import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticate, isAdminOrStaff } from '../middlewares/authMiddleware.js';
const router = express.Router();

// Route to get dashboard statistics
router.get('/stats', authenticate,isAdminOrStaff, getDashboardStats);

export default router;