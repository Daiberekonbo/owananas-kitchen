import express from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { config } from './config.js';

const app = express();

app.disable('x-powered-by');
app.use(cors({
  origin(origin, callback) {
    if (!origin || config.allowedOrigins.includes('*') || config.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('This origin is not allowed by the API CORS policy.'));
  }
}));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'owananas-kitchen-api' });
});

app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

app.use((error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Request validation failed.',
      details: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
  }
  if (error.code === '23505') {
    return res.status(409).json({ error: 'A record with that unique value already exists.' });
  }
  if (error.message?.includes('CORS')) {
    return res.status(403).json({ error: error.message });
  }
  console.error('[api]', error);
  return res.status(error.statusCode || 500).json({
    error: error.statusCode ? error.message : 'Internal server error.'
  });
});

export default app;