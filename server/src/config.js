const required = (name, value) => {
  if (!value) {
    throw new Error(`${name} is required. Copy server/.env.example to server/.env and configure it.`);
  }
  return value;
};

const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const config = {
  port: Number(process.env.PORT || 3001),
  databaseUrl: required('DATABASE_URL', process.env.DATABASE_URL),
  jwtSecret: required('JWT_SECRET or SESSION_SECRET', process.env.JWT_SECRET || process.env.SESSION_SECRET),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  allowedOrigins,
  ownerEmail: process.env.OWNER_EMAIL || '',
  resendFromEmail: process.env.RESEND_FROM_EMAIL || ''
};