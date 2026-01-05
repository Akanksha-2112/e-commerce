import express from 'express';
import {
    getCategories,
    getCategoryById,
    createCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(getCategories)
    .post(protect, admin, createCategory);

router.route('/:id')
    .get(getCategoryById)
    .delete(protect, admin, deleteCategory);

export default router;
