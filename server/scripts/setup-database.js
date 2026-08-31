import 'dotenv/config';
import fs from 'node:fs/promises';
import { pool } from '../src/db.js';

try {
  const schema = await fs.readFile(new URL('../sql/schema.sql', import.meta.url), 'utf8');
  await pool.query(schema);
  console.log('Database schema is ready.');
} finally {
  await pool.end();
}