import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Route to get dashboard statistics
router.get('/stats', authenticate, isAdmin, getDashboardStats);

export default router;