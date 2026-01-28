/**
 * Global error handling middleware
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', {
    status: statusCode,
    message: message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      statusCode: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

/**
 * Catch-all middleware for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const notFoundHandler = (req, res) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
      statusCode: 404,
    },
  });
};

export { errorHandler, notFoundHandler };
