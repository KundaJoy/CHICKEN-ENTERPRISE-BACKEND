import express from 'express';
import {
  createChicken,
  getAllChickens,
  getChickenById,
  updateChicken,
  deleteChicken,
} from '../controllers/chickenController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // all chicken routes protected

router.route('/')
  .post(createChicken)
  .get(getAllChickens);

router.route('/:id')
  .get(getChickenById)
  .put(updateChicken)
  .delete(deleteChicken);

export default router;
