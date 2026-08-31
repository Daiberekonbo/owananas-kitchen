import 'dotenv/config';
import process from 'node:process';
import app from './app.js';
import { config } from './config.js';
import { pool } from './db.js';

const server = app.listen(config.port, '0.0.0.0', () => {
  console.log(`Owanana's Kitchen API listening on port ${config.port}`);
});

const shutdown = async (signal) => {
  console.log(`${signal} received; shutting down.`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));