// middleware/adminOnly.js
import { errorHandler } from './error.js';

export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(errorHandler(403, 'Access denied: Admins only'));
  }
  next();
};
