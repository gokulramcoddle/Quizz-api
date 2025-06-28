import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUser, getUserDashboard } from '../controllers/userController.js';

const router = express.Router();

router.get('/:id', protect, getUser);
router.get('/dashboard/:user_id', protect, getUserDashboard);

export default router;
