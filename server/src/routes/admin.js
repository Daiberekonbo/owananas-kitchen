import { Router } from 'express';
import crypto from 'node:crypto';
import { comparePassword, hashPassword, issueToken, requireAuth, requireOwner } from '../auth.js';
import { query } from '../db.js';
import { foodSchema, foodUpdateSchema, loginSchema, packageSchema, packageUpdateSchema, staffSchema } from '../schemas.js';

const router = Router();

const foodFields = ['name', 'price', 'description', 'image', 'category'];
const packageFields = ['name', 'description', 'price', 'image'];

function parsePositiveId(value, label) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id < 1) {
    const error = new Error(`${label} id must be a positive integer.`);
    error.statusCode = 400;
    throw error;
  }
  return id;
}

function buildUpdateQuery(table, fields, input, idColumn = 'id') {
  const entries = fields.filter((field) => input[field] !== undefined);
  const assignments = entries.map((field, index) => `${field} = $${index + 1}`);
  assignments.push('updated_at = NOW()');
  return {
    sql: `UPDATE ${table} SET ${assignments.join(', ')} WHERE ${idColumn} = $${entries.length + 1} RETURNING *`,
    params: [...entries.map((field) => input[field]), input[idColumn]]
  };
}

router.post('/login', async (req, res, next) => {
  try {
    const input = loginSchema.parse(req.body);
    const result = await query(
      'SELECT id, username, password_hash, role FROM admin_users WHERE username = $1',
      [input.username]
    );
    const admin = result.rows[0];
    if (!admin || !(await comparePassword(input.password, admin.password_hash))) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    return res.json({
      token: issueToken(admin),
      admin: { id: admin.id, username: admin.username, role: admin.role }
    });
  } catch (error) {
    return next(error);
  }
});

router.use(requireAuth);

router.get('/orders', async (_req, res, next) => {
  try {
    const ordersResult = await query(
      `SELECT id, order_ref, customer_name, customer_phone, customer_email,
              customer_address, customer_notes, total, created_at
       FROM orders ORDER BY created_at DESC`
    );
    const itemsResult = await query(
      `SELECT order_id, item_type, item_id, name, unit_price, quantity
       FROM order_items ORDER BY id ASC`
    );
    const itemsByOrder = new Map();
    for (const item of itemsResult.rows) {
      const items = itemsByOrder.get(item.order_id) || [];
      items.push({
        id: item.item_id,
        type: item.item_type,
        name: item.name,
        price: item.unit_price,
        quantity: item.quantity
      });
      itemsByOrder.set(item.order_id, items);
    }

    return res.json(ordersResult.rows.map((order) => ({
      id: order.id,
      orderRef: order.order_ref,
      customer: {
        name: order.customer_name,
        phone: order.customer_phone,
        email: order.customer_email,
        address: order.customer_address,
        notes: order.customer_notes || ''
      },
      items: itemsByOrder.get(order.id) || [],
      total: order.total,
      timestamp: order.created_at
    })));
  } catch (error) {
    return next(error);
  }
});

router.post('/foods', async (req, res, next) => {
  try {
    const input = foodSchema.parse(req.body);
    const result = await query(
      `INSERT INTO foods (name, price, description, image, category)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, price, description, image, category`,
      [input.name, input.price, input.description, input.image, input.category]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.put('/foods/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id, 'Food');
    const input = foodUpdateSchema.parse(req.body);
    const update = buildUpdateQuery('foods', foodFields, { ...input, id });
    const result = await query(update.sql, update.params);
    if (!result.rows[0]) return res.status(404).json({ error: 'Food item not found.' });
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.delete('/foods/:id', async (req, res, next) => {
  try {
    const id = parsePositiveId(req.params.id, 'Food');
    const result = await query('DELETE FROM foods WHERE id = $1 RETURNING id', [id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Food item not found.' });
    return res.json({ message: 'Food item deleted.', id });
  } catch (error) {
    return next(error);
  }
});

router.post('/packages', async (req, res, next) => {
  try {
    const input = packageSchema.parse(req.body);
    const id = input.id || `pkg-${crypto.randomUUID().slice(0, 8)}`;
    const result = await query(
      `INSERT INTO food_packages (id, name, description, price, image)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, description, price, image`,
      [id, input.name, input.description, input.price, input.image]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.put('/packages/:id', async (req, res, next) => {
  try {
    const input = packageUpdateSchema.parse(req.body);
    const update = buildUpdateQuery('food_packages', packageFields, { ...input, id: req.params.id });
    const result = await query(update.sql, update.params);
    if (!result.rows[0]) return res.status(404).json({ error: 'Food package not found.' });
    return res.json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

router.delete('/packages/:id', async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM food_packages WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Food package not found.' });
    return res.json({ message: 'Food package deleted.', id: req.params.id });
  } catch (error) {
    return next(error);
  }
});

router.post('/staff', requireOwner, async (req, res, next) => {
  try {
    const input = staffSchema.parse(req.body);
    const passwordHash = await hashPassword(input.password);
    const result = await query(
      `INSERT INTO admin_users (username, password_hash, role)
       VALUES ($1, $2, 'staff')
       RETURNING id, username, role, created_at`,
      [input.username, passwordHash]
    );
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    return next(error);
  }
});

export default router;