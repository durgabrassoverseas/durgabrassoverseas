import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
const router = express.Router();

// Route to get dashboard statistics
router.get('/stats', getDashboardStats);

export default router;