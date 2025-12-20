import express from 'express';
import {
  createSale,
  getAllSales,
  getSaleById,
  updateSale,
  deleteSale,
} from '../controllers/saleControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // all chicken routes protected

router.route('/')
  .post(createSale)
  .get(getAllSales);

router.route('/:id')
  .get(getSaleById)
  .put(updateSale)
  .delete(deleteSale);

export default router;
