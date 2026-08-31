import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config.js';

export const hashPassword = (password) => bcrypt.hash(password, 12);
export const comparePassword = (password, hash) => bcrypt.compare(password, hash);

export function issueToken(admin) {
  return jwt.sign(
    { sub: String(admin.id), username: admin.username, role: admin.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

export function requireAuth(req, res, next) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'A Bearer token is required.' });
  }

  try {
    req.admin = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'The provided token is invalid or expired.' });
  }
}

export function requireOwner(req, res, next) {
  if (req.admin?.role !== 'owner') {
    return res.status(403).json({ error: 'Owner permissions are required.' });
  }
  return next();
}