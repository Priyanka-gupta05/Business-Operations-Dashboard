# Retail Order Management System - Backend Setup Guide

## Project Overview

This is a Node.js backend for a Retail Order Management System built with Express.js and MongoDB (Mongoose). The project follows industry best practices with a clean, modular architecture.

## Project Structure

```
Business-Operations-Dashboard/
├── backend/                  # Backend folder (YOU ARE HERE)
│   ├── config/
│   │   └── db.js            # MongoDB connection configuration
│   ├── models/              # Mongoose schemas (to be developed)
│   ├── routes/              # API route handlers (to be developed)
│   ├── controllers/         # Business logic (to be developed)
│   ├── middleware/
│   │   └── errorHandler.js  # Global error handling middleware
│   ├── app.js               # Express app initialization
│   ├── server.js            # Server entry point
│   ├── package.json         # Project dependencies
│   ├── .env.example         # Environment variables template
│   └── ReadMe               # Project overview
├── frontend/                # Frontend React app
└── .gitignore               # Git ignore rules
```

**Note**: Navigate to the `backend` folder before running commands.

## Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **MongoDB** (Local installation or MongoDB Atlas account)

## Setup Instructions

### 1. Navigate to Backend Folder

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **nodemon**: Development server auto-reload

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/retail-order-management
CORS_ORIGIN=http://localhost:3000
```

### 3. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service (Windows)
mongod

# Or using MongoDB Compass GUI for visual management
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/retail-order-management?retryWrites=true&w=majority
```

### 4. Run the Server

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

**Expected Output:**
```
═══════════════════════════════════════════════════════
  Retail Order Management System
═══════════════════════════════════════════════════════
✓ Server running in development mode
✓ Server listening on http://localhost:5000
✓ Health check: http://localhost:5000/health
═══════════════════════════════════════════════════════
✓ MongoDB connected successfully
Database: retail-order-management
```

### 5. Test the Server

Visit in your browser or use curl/Postman:

```bash
curl http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-28T10:00:00.000Z"
}
```

## Features Implemented

✅ **Express.js Server** - RESTful API foundation
✅ **MongoDB/Mongoose** - Database connection with error handling
✅ **ES6 Syntax** - Modern JavaScript (async/await, modules)
✅ **Error Handling** - Global error middleware with 404 handler
✅ **CORS Support** - Cross-origin requests enabled
✅ **Environment Management** - Dotenv configuration
✅ **Health Check Endpoint** - Server status monitoring
✅ **Graceful Shutdown** - SIGTERM/SIGINT signal handling
✅ **Modular Structure** - Organized folders for scalability

## Next Steps - Feature Development

### To Add New Features:

#### 1. Create Models (in `models/`)
```javascript
// Example: models/Order.js
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  customer: String,
  status: String,
  // ... fields
});

export default mongoose.model('Order', orderSchema);
```

#### 2. Create Controllers (in `controllers/`)
```javascript
// Example: controllers/orderController.js
export const getOrders = async (req, res, next) => {
  try {
    // Logic here
  } catch (error) {
    next(error);
  }
};
```

#### 3. Create Routes (in `routes/`)
```javascript
// Example: routes/orders.js
import express from 'express';
import { getOrders } from '../controllers/orderController.js';

const router = express.Router();
router.get('/', getOrders);
export default router;
```

#### 4. Register Routes in `app.js`
```javascript
import ordersRouter from './routes/orders.js';
app.use('/api/orders', ordersRouter);
```

## API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

## Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Application environment |
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/retail-order-management` | MongoDB connection string |
| `CORS_ORIGIN` | `*` | Allowed CORS origins |

## Development Tips

- **Use async/await** for asynchronous operations
- **Error handling** - Always use try/catch or pass errors to `next()`
- **Status codes** - Use appropriate HTTP status codes
- **Validation** - Validate request data before processing
- **Logging** - Use meaningful console.log messages for debugging

## Troubleshooting

### MongoDB Connection Failed
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- Check network connectivity for Atlas

### Port Already in Use
```bash
# Change PORT in .env or use:
PORT=3001 npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Script Commands

```bash
npm start        # Start production server
npm run dev      # Start development server with auto-reload
npm test         # Run tests (not configured yet)
```

## License

MIT

## Support

For issues or questions, refer to the documentation in `/docs` folder.
