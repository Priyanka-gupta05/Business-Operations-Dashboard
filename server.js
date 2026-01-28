import dotenv from 'dotenv';
import app from './app.js';

// Load environment variables
dotenv.config();

/**
 * Server Configuration
 */
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Start Server
 */
const server = app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Retail Order Management System');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`✓ Server running in ${NODE_ENV} mode`);
  console.log(`✓ Server listening on http://localhost:${PORT}`);
  console.log(`✓ Health check: http://localhost:${PORT}/health`);
  console.log('═══════════════════════════════════════════════════════');
});

/**
 * Graceful shutdown handling
 */
process.on('SIGTERM', () => {
  console.log('\n⚠ SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✓ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠ SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✓ HTTP server closed');
    process.exit(0);
  });
});

/**
 * Unhandled rejection handler
 */
process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
