import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import productRoutes from './routes/productRoutes.js';

/**
 * Initialize and configure Express application
 */
const app = express();

/**
 * Middleware Setup
 */
// Connect to MongoDB
await connectDB();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

/**
 * Health Check Route
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * API Routes
 * Routes will be added here as features are developed
 */
app.use('/api/products', productRoutes);
// Example: app.use('/api/orders', ordersRouter);
// Example: app.use('/api/customers', customersRouter);

/**
 * Error Handling Middleware
 */
// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
