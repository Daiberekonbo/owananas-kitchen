import 'dotenv/config';
import { pool } from '../src/db.js';
import { foods, packages } from '../src/seed-data.js';

try {
  await pool.query('BEGIN');
  for (const food of foods) {
    await pool.query(
      `INSERT INTO foods (id, name, price, description, image, category)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, price = EXCLUDED.price, description = EXCLUDED.description,
         image = EXCLUDED.image, category = EXCLUDED.category, updated_at = NOW()`,
      [food.id, food.name, food.price, food.description, food.image, food.category]
    );
  }
  for (const item of packages) {
    await pool.query(
      `INSERT INTO food_packages (id, name, description, price, image)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price,
         image = EXCLUDED.image, updated_at = NOW()`,
      [item.id, item.name, item.description, item.price, item.image]
    );
  }
  await pool.query(
    `SELECT setval(pg_get_serial_sequence('foods', 'id'),
      COALESCE((SELECT MAX(id) FROM foods), 1), true)`
  );
  await pool.query('COMMIT');
  console.log(`Seeded ${foods.length} foods and ${packages.length} packages.`);
} catch (error) {
  await pool.query('ROLLBACK');
  throw error;
} finally {
  await pool.end();
}