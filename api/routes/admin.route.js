import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { adminOnly } from '../utils/adminOnly.js';
import {
  getAllUsers,
  deleteUser,
  getAllListings,
  deleteListing,
} from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/users', verifyToken, adminOnly, getAllUsers);
router.delete('/users/:id', verifyToken, adminOnly, deleteUser);

router.get('/listings', verifyToken, adminOnly, getAllListings);
router.delete('/listings/:id', verifyToken, adminOnly, deleteListing);

export default router;
