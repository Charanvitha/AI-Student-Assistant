import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return next({ status: 401, message: 'Authentication token missing' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('-password');
    if (!user) {
      return next({ status: 401, message: 'User not found' });
    }

    req.user = user;
    next();
  } catch {
    next({ status: 401, message: 'Invalid or expired token' });
  }
}
