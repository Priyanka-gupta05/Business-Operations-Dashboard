# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js v14+ installed
- MongoDB running locally OR MongoDB Atlas account

### Step 1: Navigate to Backend

```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/retail-order-management
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Start the Server
```bash
npm run dev
```

### Step 5: Test It Works
```bash
curl http://localhost:5000/health
```

**Success! You should see:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-28T10:00:00.000Z"
}
```

---

## 📁 Project Structure at a Glance

```
Business-Operations-Dashboard/
├── backend/      → Backend Node.js app (YOU ARE HERE)
│   ├── config/       → Database configuration
│   ├── models/       → Database schemas (Mongoose)
│   ├── controllers/  → Business logic
│   ├── routes/       → API endpoints
│   ├── middleware/   → Error handling & custom logic
│   ├── app.js        → Express setup
│   ├── server.js     → Server entry point
│   └── .env          → Configuration variables
└── frontend/     → React frontend app
```

---

## 🔧 Available Commands

```bash
npm run dev       # Start with auto-reload (development)
npm start         # Start server (production)
npm test          # Run tests
```

---

## 📝 Adding a New Feature

### 1. Create Model
**File**: `models/Order.js`
```javascript
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  status: { type: String, enum: ['pending', 'completed'] },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
```

### 2. Create Controller
**File**: `controllers/orderController.js`
```javascript
import Order from '../models/Order.js';

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
```

### 3. Create Routes
**File**: `routes/orderRoutes.js`
```javascript
import express from 'express';
import { getOrders } from '../controllers/orderController.js';

const router = express.Router();
router.get('/', getOrders);
export default router;
```

### 4. Register Routes
**File**: `app.js` (add after other routes)
```javascript
import orderRoutes from './routes/orderRoutes.js';
app.use('/api/orders', orderRoutes);
```

---

## 🛠️ Environment Variables Reference

| Variable | Example | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | App environment |
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://localhost:27017/retail-order-management` | Database URL |
| `CORS_ORIGIN` | `http://localhost:3000` | Frontend URL |

---

## 🔍 API Response Format

**All responses follow this format:**

Success:
```json
{
  "success": true,
  "data": { /* your data */ }
}
```

Error:
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `MongoDB connection failed` | Check if MongoDB is running & `MONGODB_URI` is correct |
| `Port 5000 in use` | Change `PORT` in `.env` to available port |
| `Cannot find module` | Run `npm install` again |

---

## 📚 Additional Resources

- **Setup Guide**: See [SETUP.md](SETUP.md)
- **Project Structure**: See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- **Requirements**: See [docs/requirements.md](docs/requirements.md)

---

## ✅ What's Included

- ✓ Express.js server
- ✓ MongoDB/Mongoose setup
- ✓ Error handling middleware
- ✓ CORS support
- ✓ Health check endpoint
- ✓ Graceful shutdown handling
- ✓ Example templates (model, controller, routes)

---

**Happy coding! 🎉**
