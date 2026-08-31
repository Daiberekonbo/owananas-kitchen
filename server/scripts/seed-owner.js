import 'dotenv/config';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { hashPassword } from '../src/auth.js';
import { pool } from '../src/db.js';

const rl = readline.createInterface({ input, output });
const username = process.env.INITIAL_OWNER_USERNAME
  || await rl.question('Owner username: ');
const password = process.env.INITIAL_OWNER_PASSWORD
  || await rl.question('Owner password (8+ characters): ');
rl.close();

if (!username.trim() || password.length < 8) {
  throw new Error('A username and a password of at least 8 characters are required.');
}

try {
  const passwordHash = await hashPassword(password);
  const result = await pool.query(
    `INSERT INTO admin_users (username, password_hash, role)
     VALUES ($1, $2, 'owner')
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'owner'
     RETURNING id, username, role`,
    [username.trim(), passwordHash]
  );
  console.log(`Owner account ready for "${result.rows[0].username}".`);
} finally {
  await pool.end();
}