import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// FIX: Validate order creation payload
const orderValidation = [
  body('orderItems').isArray({ min: 1 }).withMessage('Order must have at least one item'),
  body('orderItems.*.product').isMongoId().withMessage('Valid product ID required'),
  body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('orderItems.*.price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
  body('paymentMethod').trim().notEmpty().withMessage('Payment method is required'),
  body('totalPrice').isFloat({ gt: 0 }).withMessage('Total price must be greater than 0'),
];

router.route('/')
  .post(protect, orderValidation, validateRequest, createOrder)
  .get(protect, getUserOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;
