import express from 'express';
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from '../controllers/exampleController.js';

/**
 * Example Routes Template
 * Replace routes with your actual routes
 */
const router = express.Router();

/**
 * @route   GET /api/items
 * @desc    Get all items
 * @access  Public
 */
router.get('/', getAllItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get item by ID
 * @access  Public
 */
router.get('/:id', getItemById);

/**
 * @route   POST /api/items
 * @desc    Create new item
 * @access  Public (add authentication as needed)
 */
router.post('/', createItem);

/**
 * @route   PUT /api/items/:id
 * @desc    Update item by ID
 * @access  Public (add authentication as needed)
 */
router.put('/:id', updateItem);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete item by ID
 * @access  Public (add authentication as needed)
 */
router.delete('/:id', deleteItem);

export default router;
