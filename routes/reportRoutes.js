import express from 'express';
import {
  getSummary,
  getDailyReport,
  getWeeklyReport,
  getMonthlyReport,
  getLast6MonthsReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/summary', protect, getSummary);
router.get('/daily', protect, getDailyReport);
router.get('/weekly', protect, getWeeklyReport);
router.get('/monthly', protect, getMonthlyReport);
router.get('/monthly-summary', protect, getLast6MonthsReport); // ✅ NEW

export default router;

