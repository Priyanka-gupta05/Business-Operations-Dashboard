import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';

/**
 * Product Routes
 * Base URL: /api/products
 */
const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products
 * @access  Public
 */
router.get('/', getAllProducts);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (should be Protected)
 */
router.post('/', createProduct);

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   PUT /api/products/:id
 * @desc    Update product by ID
 * @access  Public (should be Protected)
 */
router.put('/:id', updateProduct);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product by ID
 * @access  Public (should be Protected)
 */
router.delete('/:id', deleteProduct);

export default router;
