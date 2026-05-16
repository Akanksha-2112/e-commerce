import express from 'express';
import { body } from 'express-validator';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  createProductReview
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// FIX: Validation rules for creating/updating a product
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  // FIX: Validate images array so arbitrary strings can't be injected
  body('images').optional().isArray({ max: 10 }).withMessage('Max 10 images allowed'),
  body('images.*.url').optional().isURL().withMessage('Each image must have a valid URL'),
];

router.route('/')
  .get(getProducts)
  .post(protect, admin, productValidation, validateRequest, createProduct);

router.get('/featured', getFeaturedProducts);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, [
    body('price').optional().isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
    // FIX: stock uses isInt so that setting stock=0 (sold out) works correctly
    body('stock').optional().isInt({ min: 0 }).withMessage('Stock cannot be negative'),
    body('images').optional().isArray({ max: 10 }),
    body('images.*.url').optional().isURL(),
  ], validateRequest, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, [
  body('rating').isNumeric().withMessage('Rating must be a number between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
], validateRequest, createProductReview);

export default router;
