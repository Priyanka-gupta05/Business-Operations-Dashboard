import { body, validationResult, param } from 'express-validator';

/**
 * Validation middleware for Product creation
 */
export const validateProductCreation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters long')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10 })
    .withMessage('Product description must be at least 10 characters long')
    .isLength({ max: 1000 })
    .withMessage('Product description cannot exceed 1000 characters'),

  body('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ min: 0.01 })
    .withMessage('Product price must be a number greater than 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('category')
    .notEmpty()
    .withMessage('Product category is required')
    .isIn(['Men', 'Women', 'Unisex'])
    .withMessage('Category must be one of: Men, Women, Unisex'),

  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
];

/**
 * Validation middleware for Product update
 */
export const validateProductUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters long')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Product description must be at least 10 characters long')
    .isLength({ max: 1000 })
    .withMessage('Product description cannot exceed 1000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Product price must be a number greater than 0'),

  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),

  body('category')
    .optional()
    .isIn(['Men', 'Women', 'Unisex'])
    .withMessage('Category must be one of: Men, Women, Unisex'),

  body('imageUrl')
    .optional()
    .trim()
    .isURL()
    .withMessage('Image URL must be a valid URL'),

  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value'),
];

/**
 * Validation middleware for MongoDB ObjectId
 */
export const validateMongoId = [
  param('id')
    .matches(/^[0-9a-fA-F]{24}$/)
    .withMessage('Invalid product ID format'),
];

/**
 * Error handler middleware for validation
 * Call this after all validation middlewares
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.param || 'unknown',
        message: err.msg,
      })),
    });
  }

  next();
};
