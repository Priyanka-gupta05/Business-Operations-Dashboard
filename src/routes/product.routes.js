import express from 'express';
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  restoreProduct,
} from '../controllers/product.controller.js';

import {
  validateProductCreation,
  validateProductUpdate,
  validateMongoId,
  handleValidationErrors,
} from '../middleware/validateProduct.js';

const router = express.Router();

/**
 * Route: POST /api/products
 * Description: Create a new product
 * Body: { name, description, price, stock, category, imageUrl }
 * Response: { success, message, data }
 */
router.post(
  '/',
  validateProductCreation,
  handleValidationErrors,
  createProduct
);

/**
 * Route: GET /api/products
 * Description: Get all active products with filtering and sorting
 * Query Parameters:
 *   - category: "Men" | "Women" | "Unisex"
 *   - minPrice: number
 *   - maxPrice: number
 *   - sort: "price" | "name" | "createdAt" | "stock"
 *   - order: "asc" | "desc"
 *   - page: number (default: 1)
 *   - limit: number (default: 10)
 * Response: { success, count, total, data }
 */
router.get('/', getAllProducts);

/**
 * Route: GET /api/products/:id
 * Description: Get a single product by ID
 * Response: { success, data }
 */
router.get('/:id', validateMongoId, handleValidationErrors, getProductById);

/**
 * Route: PUT /api/products/:id
 * Description: Update a product
 * Body: Partial product object { name?, description?, price?, stock?, category?, imageUrl?, isActive? }
 * Response: { success, message, data }
 */
router.put(
  '/:id',
  validateMongoId,
  validateProductUpdate,
  handleValidationErrors,
  updateProduct
);

/**
 * Route: DELETE /api/products/:id
 * Description: Soft delete a product (sets isActive to false)
 * Response: { success, message, data }
 */
router.delete(
  '/:id',
  validateMongoId,
  handleValidationErrors,
  deleteProduct
);

/**
 * Route: GET /api/products/admin/all
 * Description: Get all products (including inactive ones) - Admin only
 * Query Parameters: Same as GET /api/products
 * Response: { success, count, total, data }
 */
router.get('/admin/all', getAllProductsAdmin);

/**
 * Route: PUT /api/products/:id/restore
 * Description: Restore a deleted product (sets isActive to true)
 * Response: { success, message, data }
 */
router.put(
  '/:id/restore',
  validateMongoId,
  handleValidationErrors,
  restoreProduct
);

export default router;
