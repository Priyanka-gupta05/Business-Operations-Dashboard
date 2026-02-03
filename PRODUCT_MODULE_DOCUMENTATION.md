# Product Management Module - Implementation Guide

## 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [File Structure](#file-structure)
4. [Components](#components)
5. [Features](#features)
6. [Installation](#installation)
7. [Usage](#usage)
8. [API Reference](#api-reference)
9. [Error Handling](#error-handling)
10. [Validation Rules](#validation-rules)

---

## 🎯 Overview

The Product Management Module is a complete CRUD system for managing fragrance products in the Retail Order Management System (ROMS). It provides robust APIs for creating, reading, updating, and deleting products with advanced filtering, sorting, and pagination capabilities.

### Key Features

✅ **Full CRUD Operations** - Create, Read, Update, Delete products
✅ **Advanced Filtering** - Filter by category, price range
✅ **Sorting & Pagination** - Sort by multiple fields with pagination support
✅ **Soft Deletes** - Products are soft-deleted (not permanently removed)
✅ **Input Validation** - Comprehensive validation using express-validator
✅ **Error Handling** - Centralized error handling with meaningful messages
✅ **Database Indexes** - Optimized queries with strategic indexes
✅ **RESTful Design** - Follows REST best practices

---

## 🏗️ Architecture

### Layered Architecture

```
┌─────────────────────────────────────┐
│         Routes Layer                │
│  (src/routes/product.routes.js)     │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│     Validation Middleware           │
│  (src/middleware/validateProduct.js)│
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│      Controller Layer               │
│ (src/controllers/product.controller)│
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       Model & Database              │
│   (src/models/Product.js)           │
│   (Mongoose + MongoDB)              │
└─────────────────────────────────────┘
```

### Separation of Concerns

- **Routes:** HTTP endpoint definitions and routing
- **Controllers:** Business logic and request handling
- **Models:** Database schema and validation
- **Middleware:** Request validation and error handling
- **Utils:** Reusable utilities (APIFeatures for filtering)

---

## 📂 File Structure

```
src/
├── models/
│   └── Product.js                    # Mongoose schema and model
├── controllers/
│   └── product.controller.js         # CRUD operation logic
├── routes/
│   └── product.routes.js             # Route definitions
├── middleware/
│   └── validateProduct.js            # Input validation middleware
└── utils/
    └── apiFeatures.js                # Filtering and sorting utility
```

---

## 🔧 Components

### 1. Product Model (`src/models/Product.js`)

**Purpose:** Define the MongoDB schema for products

**Fields:**

| Field | Type | Required | Validation | Default |
|-------|------|----------|-----------|---------|
| `name` | String | Yes | 3-100 chars, trim | - |
| `description` | String | Yes | 10-1000 chars | - |
| `price` | Number | Yes | Must be > 0 | - |
| `stock` | Number | No | >= 0, integer | 0 |
| `category` | String | Yes | ['Men', 'Women', 'Unisex'] | - |
| `imageUrl` | String | No | Valid URL | - |
| `isActive` | Boolean | No | - | true |
| `createdAt` | Date | Auto | - | Date.now |
| `updatedAt` | Date | Auto | - | Date.now |

**Indexes:**
```javascript
productSchema.index({ name: 1 });          // For text search
productSchema.index({ category: 1 });      // For filtering
productSchema.index({ createdAt: -1 });    // For sorting
```

---

### 2. Product Controller (`src/controllers/product.controller.js`)

**Purpose:** Handle all business logic for product operations

**Exported Functions:**

#### `createProduct(req, res, next)`
Creates a new product with validation.
- **Input:** Request body with product data
- **Output:** 201 Created status with product data
- **Error Handling:** Catches and passes errors to next()

#### `getAllProducts(req, res, next)`
Fetches all active products with filtering and sorting.
- **Features:**
  - Filters by category, price range
  - Sorts by configurable fields
  - Supports pagination
  - Only returns active products (isActive: true)
- **Input:** Query parameters for filtering/sorting/pagination
- **Output:** 200 OK with array of products

#### `getProductById(req, res, next)`
Retrieves a single product by MongoDB ID.
- **Input:** Product ID in URL parameter
- **Output:** 200 OK with product data
- **Error:** 404 if not found

#### `updateProduct(req, res, next)`
Updates an existing product (partial update supported).
- **Features:**
  - Allows updating any product field
  - Runs validators on updated fields
  - Uses findByIdAndUpdate with { new: true, runValidators: true }
- **Input:** Product ID and update data
- **Output:** 200 OK with updated product

#### `deleteProduct(req, res, next)`
Soft deletes a product by setting isActive to false.
- **Input:** Product ID
- **Output:** 200 OK with updated product (isActive: false)
- **Note:** Product is not permanently deleted

#### `restoreProduct(req, res, next)`
Restores a deleted product by setting isActive to true.
- **Input:** Product ID
- **Output:** 200 OK with restored product

#### `getAllProductsAdmin(req, res, next)`
Fetches all products including deleted ones (admin endpoint).
- **Input:** Query parameters (same as getAllProducts)
- **Output:** 200 OK with all products

---

### 3. Product Routes (`src/routes/product.routes.js`)

**Purpose:** Define HTTP endpoints and attach middleware

**Routes:**

```javascript
POST   /api/products                    // Create product
GET    /api/products                    // Get all active products
GET    /api/products/:id                // Get single product
PUT    /api/products/:id                // Update product
DELETE /api/products/:id                // Soft delete product
PUT    /api/products/:id/restore        // Restore deleted product
GET    /api/products/admin/all          // Get all products (admin)
```

---

### 4. Validation Middleware (`src/middleware/validateProduct.js`)

**Purpose:** Validate request data before processing

**Exported Middleware:**

#### `validateProductCreation`
Array of validation rules for POST requests.
```javascript
body('name')              // 3-100 characters
body('description')       // 10-1000 characters
body('price')             // Must be > 0
body('stock')             // Must be >= 0
body('category')          // Must be 'Men', 'Women', 'Unisex'
body('imageUrl')          // Must be valid URL
```

#### `validateProductUpdate`
Lighter validation for PUT requests (all fields optional).

#### `validateMongoId`
Validates MongoDB ObjectId format for ID parameters.

#### `handleValidationErrors`
Middleware that checks for validation errors and returns 400 if found.

---

### 5. API Features Utility (`src/utils/apiFeatures.js`)

**Purpose:** Handle filtering, sorting, and pagination

**Methods:**

#### `filter()`
Filters products based on query parameters.
- **Supported Filters:**
  - `category` - Exact match
  - `minPrice` / `maxPrice` - Range query
  - `isActive` - Boolean filter

#### `sort()`
Sorts results by specified field.
- **Valid Fields:** price, name, createdAt, stock
- **Default:** createdAt (descending)
- **Order:** asc or desc

#### `paginate()`
Implements pagination.
- **Defaults:** page=1, limit=10
- **Max Limit:** 100
- **Validation:** Page > 0, Limit between 1-100

**Usage Pattern:**
```javascript
const features = new APIFeatures(Product.find({ isActive: true }), req.query);
features.filter().sort().paginate();
const products = await features.query;
```

---

## ✨ Features

### 1. **Comprehensive Validation**
- Field-level validation using express-validator
- Custom validation messages
- Type checking and format validation
- Range and length constraints

### 2. **Advanced Filtering**
- Single and multiple filter support
- Price range filtering with min/max
- Category-based filtering
- Active status filtering

### 3. **Flexible Sorting**
- Sort by any indexed field
- Ascending/Descending order
- Default smart sorting (newest first)

### 4. **Pagination**
- Offset-based pagination
- Configurable page size
- Maximum limit safeguard
- Total count metadata

### 5. **Soft Deletes**
- Products marked as inactive instead of deleted
- Restore functionality available
- Separate admin endpoint to view all products
- Data recovery capability

### 6. **Error Handling**
- Centralized error handler
- Meaningful error messages
- Proper HTTP status codes
- Validation error details

---

## 📦 Installation

### Prerequisites

```bash
npm install express mongoose express-validator dotenv
```

### Environment Setup

Ensure your `.env` file contains:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/roms
NODE_ENV=development
PORT=3000
```

### Integration with App

The module is automatically integrated in `app.js`:

```javascript
import productRoutes from './src/routes/product.routes.js';

// ... middleware setup ...

// Product Management Routes
app.use('/api/products', productRoutes);
```

---

## 🚀 Usage Examples

### Create a Product

```javascript
const response = await fetch('http://localhost:3000/api/products', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "Dior Sauvage",
    description: "Luxurious fragrance with spice notes",
    price: 2499.99,
    stock: 50,
    category: "Men",
    imageUrl: "https://example.com/dior.jpg"
  })
});

const product = await response.json();
```

### Filter Products

```javascript
// Get Men's fragrances between 1000-3000
const url = new URL('http://localhost:3000/api/products');
url.searchParams.set('category', 'Men');
url.searchParams.set('minPrice', '1000');
url.searchParams.set('maxPrice', '3000');
url.searchParams.set('sort', 'price');
url.searchParams.set('order', 'asc');

const response = await fetch(url);
const products = await response.json();
```

### Update a Product

```javascript
const productId = '65a1b2c3d4e5f6g7h8i9j0k1';

const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    stock: 45,
    price: 2599.99
  })
});

const updated = await response.json();
```

### Delete and Restore

```javascript
const productId = '65a1b2c3d4e5f6g7h8i9j0k1';

// Soft delete
await fetch(`http://localhost:3000/api/products/${productId}`, {
  method: 'DELETE'
});

// Restore
await fetch(`http://localhost:3000/api/products/${productId}/restore`, {
  method: 'PUT'
});
```

---

## 🔌 API Reference

### Response Structure

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* product data */ }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ /* validation errors */ ]
}
```

### HTTP Status Codes

| Code | Usage |
|------|-------|
| 201 | Product created successfully |
| 200 | Successful GET, PUT, DELETE |
| 400 | Validation failed, bad request |
| 404 | Product not found |
| 500 | Server error |

---

## 🛡️ Error Handling

### Validation Errors (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "price",
      "message": "Product price must be a number greater than 0"
    }
  ]
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "message": "Product not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## ✅ Validation Rules

### Name Field
- **Type:** String
- **Required:** Yes
- **Min Length:** 3 characters
- **Max Length:** 100 characters
- **Processing:** Trimmed (whitespace removed)

### Description Field
- **Type:** String
- **Required:** Yes
- **Min Length:** 10 characters
- **Max Length:** 1000 characters
- **Processing:** Trimmed

### Price Field
- **Type:** Number
- **Required:** Yes
- **Constraint:** Must be > 0
- **Validation:** Custom validator ensures > 0

### Stock Field
- **Type:** Number
- **Required:** No
- **Default:** 0
- **Constraint:** Must be >= 0
- **Type Check:** Must be integer

### Category Field
- **Type:** String
- **Required:** Yes
- **Allowed Values:** 'Men', 'Women', 'Unisex'
- **Case Sensitive:** Yes

### ImageUrl Field
- **Type:** String
- **Required:** No
- **Format:** Must be valid URL
- **Processing:** Trimmed

---

## 🔒 Security Considerations

1. **Input Sanitization:** All inputs validated and trimmed
2. **Type Validation:** Mongoose schema enforces types
3. **Enumeration:** Category limited to predefined values
4. **Range Validation:** Price and stock have min/max constraints
5. **Error Messages:** Sensitive details not exposed to clients
6. **MongoDB Injection:** Protected by Mongoose schema

---

## 📈 Performance Optimization

1. **Database Indexes:**
   - `name` - For text search
   - `category` - For filtering
   - `createdAt` - For sorting

2. **Query Optimization:**
   - Use pagination for large datasets
   - Filter data before sorting
   - Leverage indexes in queries

3. **Caching Strategy (Future):**
   - Cache GET /api/products with TTL
   - Invalidate cache on POST/PUT/DELETE

---

## 🧪 Testing Checklist

- [ ] Create product with valid data
- [ ] Create product with invalid data (validation test)
- [ ] Get all products (no filters)
- [ ] Filter by category
- [ ] Filter by price range
- [ ] Sort by price ascending
- [ ] Sort by price descending
- [ ] Pagination (page 1, 2, etc.)
- [ ] Get single product by valid ID
- [ ] Get product with invalid ID
- [ ] Update product with partial data
- [ ] Update product with invalid data
- [ ] Soft delete product
- [ ] Verify product shows as inactive
- [ ] Restore deleted product
- [ ] Admin endpoint returns all products including deleted

---

## 🔄 Database Migration

First time setup:
```bash
# Ensure MongoDB is running
# Indexes are created automatically by Mongoose
# No manual migration needed
```

---

## 📝 Contributing Guidelines

When extending this module:

1. **Maintain Structure:** Keep layered architecture
2. **Add Validation:** Validate all new inputs
3. **Handle Errors:** Wrap async operations in try-catch
4. **Document Code:** Add JSDoc comments
5. **Test Thoroughly:** Test all new features
6. **Update Tests:** Update testing guide if endpoints change

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection string set
- [ ] Error handling tested
- [ ] Validation rules verified
- [ ] Database indexes created
- [ ] All tests passing
- [ ] Security review completed

### Deployment Steps

1. Set production environment variables
2. Run database migrations if needed
3. Deploy application
4. Verify all endpoints working
5. Monitor error logs

---

## 📞 Support & Maintenance

For issues or questions:

1. Check validation rules in `validateProduct.js`
2. Review error responses in controller
3. Verify MongoDB connection
4. Check database indexes
5. Review logs for detailed error info

---

**Status:** ✅ Production Ready
**Version:** 1.0.0
**Last Updated:** January 2026
