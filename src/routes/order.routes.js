import express from 'express';
import {
  createOrder,
  getAllOrders,
  getSingleOrder,
  updateOrderStatus,
} from '../controllers/order.controller.js';

import {
  validateOrderCreation,
  validateOrderStatusUpdate,
  validateMongoId,
  handleValidationErrors,
} from '../middleware/validateOrder.js';

import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

/**
 * Route: POST /api/orders
 * Description: Create a new order
 * Access: Protected (authenticated users)
 * Body: { products: [{ product: ObjectId, quantity: Number }] }
 * Response: { success, message, data }
 */
router.post(
  '/',
  protect,
  validateOrderCreation,
  handleValidationErrors,
  createOrder
);

/**
 * Route: GET /api/orders
 * Description: Get all orders with populated user and product data
 * Access: Admin only
 * Response: { success, count, data }
 */
router.get('/', protect, adminOnly, getAllOrders);

/**
 * Route: GET /api/orders/:id
 * Description: Get a single order by ID
 * Access: Admin or order owner
 * Params: id - Order MongoDB ObjectId
 * Response: { success, data }
 */
router.get(
  '/:id',
  protect,
  validateMongoId,
  handleValidationErrors,
  getSingleOrder
);

/**
 * Route: PUT /api/orders/:id/status
 * Description: Update order status
 * Access: Admin only
 * Params: id - Order MongoDB ObjectId
 * Body: { status: "confirmed" | "shipped" | "delivered" }
 * Response: { success, message, data }
 */
router.put(
  '/:id/status',
  protect,
  adminOnly,
  validateMongoId,
  validateOrderStatusUpdate,
  handleValidationErrors,
  updateOrderStatus
);

export default router;
