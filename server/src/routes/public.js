import { Router } from 'express';
import crypto from 'node:crypto';
import { orderSchema } from '../schemas.js';
import { query, withTransaction } from '../db.js';
import { sendOrderNotification } from '../email.js';

const router = Router();

const formatFood = (row) => ({
  id: row.id,
  name: row.name,
  price: row.price,
  description: row.description,
  image: row.image,
  category: row.category
});

const formatPackage = (row) => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  image: row.image
});

router.get('/foods', async (_req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, price, description, image, category FROM foods ORDER BY id ASC'
    );
    return res.json(result.rows.map(formatFood));
  } catch (error) {
    return next(error);
  }
});

router.get('/packages', async (_req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, description, price, image FROM food_packages ORDER BY created_at ASC, id ASC'
    );
    return res.json(result.rows.map(formatPackage));
  } catch (error) {
    return next(error);
  }
});

function orderReference() {
  return `OWK-${crypto.randomInt(100000, 1000000)}`;
}

async function resolveOrderItem(client, item) {
  const isPackage = item.type === 'package'
    || (item.type !== 'food' && typeof item.id === 'string' && item.id.startsWith('pkg-'));

  if (isPackage) {
    const result = await client.query(
      'SELECT id, name, price FROM food_packages WHERE id = $1',
      [String(item.id)]
    );
    if (!result.rows[0]) {
      const error = new Error(`Package ${item.id} was not found.`);
      error.statusCode = 400;
      throw error;
    }
    return { ...result.rows[0], itemType: 'package', itemId: String(result.rows[0].id) };
  }

  const numericId = Number(item.id);
  if (!Number.isSafeInteger(numericId) || numericId < 1) {
    const error = new Error(`Food item ${item.id} has an invalid id.`);
    error.statusCode = 400;
    throw error;
  }
  const result = await client.query(
    'SELECT id, name, price FROM foods WHERE id = $1',
    [numericId]
  );
  if (!result.rows[0]) {
    const error = new Error(`Food item ${item.id} was not found.`);
    error.statusCode = 400;
    throw error;
  }
  return { ...result.rows[0], itemType: 'food', itemId: String(result.rows[0].id) };
}

router.post('/orders', async (req, res, next) => {
  try {
    const input = orderSchema.parse(req.body);
    const created = await withTransaction(async (client) => {
      const resolvedItems = [];
      for (const item of input.items) {
        const product = await resolveOrderItem(client, item);
        resolvedItems.push({
          ...product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity
        });
      }

      const total = resolvedItems.reduce((sum, item) => sum + item.lineTotal, 0);
      let order;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const result = await client.query(
          `INSERT INTO orders
            (order_ref, customer_name, customer_phone, customer_email, customer_address, customer_notes, total)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (order_ref) DO NOTHING
           RETURNING id, order_ref, created_at, total`,
          [
            orderReference(),
            input.customer.name,
            input.customer.phone,
            input.customer.email,
            input.customer.address,
            input.customer.notes || null,
            total
          ]
        );
        if (result.rows[0]) {
          order = result.rows[0];
          break;
        }
      }
      if (!order) {
        throw new Error('Could not generate a unique order reference.');
      }

      for (const item of resolvedItems) {
        await client.query(
          `INSERT INTO order_items
            (order_id, item_type, item_id, name, unit_price, quantity)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [order.id, item.itemType, item.itemId, item.name, item.price, item.quantity]
        );
      }

      return {
        orderRef: order.order_ref,
        timestamp: order.created_at,
        total: order.total,
        customer: input.customer,
        items: resolvedItems.map((item) => ({
          id: item.itemId,
          type: item.itemType,
          name: item.name,
          unitPrice: item.price,
          quantity: item.quantity
        }))
      };
    });

    let notification;
    try {
      notification = await sendOrderNotification(created);
    } catch (error) {
      console.error(`[email] Order ${created.orderRef} was saved, but notification failed:`, error.message);
      notification = { sent: false, reason: 'Order saved, but the email notification failed.' };
    }

    return res.status(201).json({
      message: 'Order received successfully.',
      orderRef: created.orderRef,
      timestamp: created.timestamp,
      total: created.total,
      notification
    });
  } catch (error) {
    return next(error);
  }
});

export default router;