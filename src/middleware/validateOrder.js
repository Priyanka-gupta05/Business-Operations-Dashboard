import { body, validationResult, param } from 'express-validator';

/**
 * Validation middleware for Order creation
 */
export const validateOrderCreation = [
  body('products')
    .notEmpty()
    .withMessage('Products array is required')
    .isArray({ min: 1 })
    .withMessage('Products must be an array with at least one item'),

  body('products.*.product')
    .notEmpty()
    .withMessage('Product ID is required for each item')
    .custom((value) => {
      if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Product ID must be a valid MongoDB ObjectId');
      }
      return true;
    }),

  body('products.*.quantity')
    .notEmpty()
    .withMessage('Product quantity is required')
    .isInt({ min: 1 })
    .withMessage('Product quantity must be an integer greater than or equal to 1'),
];

/**
 * Validation middleware for Order status update
 */
export const validateOrderStatusUpdate = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'shipped', 'delivered'])
    .withMessage('Status must be one of: pending, confirmed, shipped, delivered'),
];

/**
 * Validation middleware for MongoDB ObjectId
 */
export const validateMongoId = [
  param('id')
    .custom((value) => {
      if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        throw new Error('Invalid MongoDB ObjectId');
      }
      return true;
    }),
];

/**
 * Error handler middleware for validation
 * Call this after all validation middlewares
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    return next(error);
  }
  next();
};
