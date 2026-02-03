# Product Management Module - Testing Guide

## 🚀 Overview

This document provides complete testing instructions for the Product Management Module of the Retail Order Management System (ROMS).

---

## 📋 API Endpoints

### Base URL
```
http://localhost:3000/api/products
```

---

## ✅ CRUD Operations

### 1. **Create Product** ➕
**Endpoint:** `POST /api/products`

**Description:** Create a new product

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Dior Sauvage",
  "description": "A luxurious fragrance with notes of ambroxan and spice, perfect for the modern man. This sophisticated perfume combines fresh citrus with warm spice notes for an unforgettable scent experience.",
  "price": 2499.99,
  "stock": 50,
  "category": "Men",
  "imageUrl": "https://example.com/images/dior-sauvage.jpg"
}
```

**Validation Rules:**
- `name` (String, required): 3-100 characters
- `description` (String, required): 10-1000 characters
- `price` (Number, required): Must be > 0
- `stock` (Number, optional): Must be ≥ 0, default is 0
- `category` (String, required): Must be one of `Men`, `Women`, `Unisex`
- `imageUrl` (String, optional): Must be valid URL format

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Dior Sauvage",
    "description": "A luxurious fragrance with notes of ambroxan and spice...",
    "price": 2499.99,
    "stock": 50,
    "category": "Men",
    "imageUrl": "https://example.com/images/dior-sauvage.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "__v": 0
  }
}
```

**Error Response:** `400 Bad Request`
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

---

### 2. **Get All Products** 📖
**Endpoint:** `GET /api/products`

**Description:** Retrieve all active products with filtering and sorting

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `category` | String | Filter by category | `Men`, `Women`, `Unisex` |
| `minPrice` | Number | Minimum price filter | `1000` |
| `maxPrice` | Number | Maximum price filter | `5000` |
| `sort` | String | Sort field | `price`, `name`, `createdAt`, `stock` |
| `order` | String | Sort order | `asc`, `desc` |
| `page` | Number | Page number (default: 1) | `1`, `2`, `3` |
| `limit` | Number | Results per page (default: 10, max: 100) | `10`, `20` |

**Example Requests:**

**Get all products (default):**
```
GET /api/products
```

**Filter by category:**
```
GET /api/products?category=Men
```

**Price range filter:**
```
GET /api/products?minPrice=1000&maxPrice=5000
```

**Sort by price (ascending):**
```
GET /api/products?sort=price&order=asc
```

**Combined filters:**
```
GET /api/products?category=Women&minPrice=2000&maxPrice=8000&sort=price&order=desc&page=1&limit=10
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "count": 2,
  "total": 15,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "Dior Sauvage",
      "description": "A luxurious fragrance...",
      "price": 2499.99,
      "stock": 50,
      "category": "Men",
      "imageUrl": "https://example.com/images/dior-sauvage.jpg",
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "name": "Chanel No. 5",
      "description": "An iconic fragrance with timeless elegance and luxury notes that define feminine grace and sophistication.",
      "price": 3299.99,
      "stock": 30,
      "category": "Women",
      "imageUrl": "https://example.com/images/chanel-5.jpg",
      "isActive": true,
      "createdAt": "2024-01-16T14:20:00.000Z",
      "updatedAt": "2024-01-16T14:20:00.000Z"
    }
  ]
}
```

**Error Response (Invalid pagination):** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "limit",
      "message": "Limit must be between 1 and 100"
    }
  ]
}
```

---

### 3. **Get Single Product** 🔍
**Endpoint:** `GET /api/products/:id`

**Description:** Retrieve a specific product by MongoDB ID

**URL Parameters:**
- `id` (String, required): Valid MongoDB ObjectId

**Example Request:**
```
GET /api/products/65a1b2c3d4e5f6g7h8i9j0k1
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Dior Sauvage",
    "description": "A luxurious fragrance with notes of ambroxan and spice...",
    "price": 2499.99,
    "stock": 50,
    "category": "Men",
    "imageUrl": "https://example.com/images/dior-sauvage.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (Not Found):** `404 Not Found`
```json
{
  "success": false,
  "message": "Product not found"
}
```

**Error Response (Invalid ID):** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "id",
      "message": "Invalid product ID format"
    }
  ]
}
```

---

### 4. **Update Product** ✏️
**Endpoint:** `PUT /api/products/:id`

**Description:** Update an existing product (partial update supported)

**URL Parameters:**
- `id` (String, required): Valid MongoDB ObjectId

**Request Body (All fields optional):**
```json
{
  "name": "Dior Sauvage Elixir",
  "price": 2699.99,
  "stock": 45,
  "description": "An enhanced version of the classic fragrance with deeper spice notes and longer longevity.",
  "category": "Men",
  "imageUrl": "https://example.com/images/dior-sauvage-elixir.jpg",
  "isActive": true
}
```

**Validation:**
- Same as creation, but all fields are optional
- Only provided fields are updated
- Validators are run on update (runValidators: true)

**Example Request:**
```
PUT /api/products/65a1b2c3d4e5f6g7h8i9j0k1
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Dior Sauvage Elixir",
    "description": "An enhanced version of the classic fragrance...",
    "price": 2699.99,
    "stock": 45,
    "category": "Men",
    "imageUrl": "https://example.com/images/dior-sauvage-elixir.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:45:00.000Z"
  }
}
```

**Error Response (Validation Failed):** `400 Bad Request`
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

---

### 5. **Delete Product (Soft Delete)** 🗑️
**Endpoint:** `DELETE /api/products/:id`

**Description:** Soft delete a product (sets `isActive` to `false`)

**URL Parameters:**
- `id` (String, required): Valid MongoDB ObjectId

**Example Request:**
```
DELETE /api/products/65a1b2c3d4e5f6g7h8i9j0k1
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Dior Sauvage",
    "description": "A luxurious fragrance...",
    "price": 2499.99,
    "stock": 50,
    "category": "Men",
    "imageUrl": "https://example.com/images/dior-sauvage.jpg",
    "isActive": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Note:** The product is not permanently deleted. To restore, use the restore endpoint.

---

### 6. **Restore Product** 🔄
**Endpoint:** `PUT /api/products/:id/restore`

**Description:** Restore a deleted product (sets `isActive` to `true`)

**URL Parameters:**
- `id` (String, required): Valid MongoDB ObjectId

**Example Request:**
```
PUT /api/products/65a1b2c3d4e5f6g7h8i9j0k1/restore
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product restored successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Dior Sauvage",
    "description": "A luxurious fragrance...",
    "price": 2499.99,
    "stock": 50,
    "category": "Men",
    "imageUrl": "https://example.com/images/dior-sauvage.jpg",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:05:00.000Z"
  }
}
```

---

### 7. **Get All Products (Admin)** 👨‍💼
**Endpoint:** `GET /api/products/admin/all`

**Description:** Get all products including deleted ones (admin only)

**Query Parameters:**
Same as "Get All Products" endpoint

**Example Request:**
```
GET /api/products/admin/all?sort=createdAt&order=desc
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "count": 3,
  "total": 18,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "name": "Deleted Product",
      "description": "This product was deleted...",
      "price": 1999.99,
      "stock": 0,
      "category": "Unisex",
      "imageUrl": "https://example.com/images/deleted.jpg",
      "isActive": false,
      "createdAt": "2024-01-14T08:00:00.000Z",
      "updatedAt": "2024-01-15T13:00:00.000Z"
    }
  ]
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Create Multiple Products

```bash
# Create Men's Fragrance
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dior Sauvage",
    "description": "A luxurious fragrance with notes of ambroxan and spice, perfect for the modern man.",
    "price": 2499.99,
    "stock": 50,
    "category": "Men",
    "imageUrl": "https://example.com/images/dior-sauvage.jpg"
  }'

# Create Women's Fragrance
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chanel No. 5",
    "description": "An iconic fragrance with timeless elegance and luxury notes that define feminine grace.",
    "price": 3299.99,
    "stock": 30,
    "category": "Women",
    "imageUrl": "https://example.com/images/chanel-5.jpg"
  }'

# Create Unisex Fragrance
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jo Malone Wood Sage & Sea Salt",
    "description": "A fresh unisex fragrance combining marine notes with earthy sage and mineral nuances.",
    "price": 1999.99,
    "stock": 75,
    "category": "Unisex",
    "imageUrl": "https://example.com/images/jomalone.jpg"
  }'
```

---

### Scenario 2: Filtering and Sorting

```bash
# Get products in price range (1500-3000) sorted by price ascending
curl "http://localhost:3000/api/products?minPrice=1500&maxPrice=3000&sort=price&order=asc"

# Get Men's category only
curl "http://localhost:3000/api/products?category=Men"

# Get Women's products sorted by newest
curl "http://localhost:3000/api/products?category=Women&sort=createdAt&order=desc"

# Get paginated results (10 per page, 2nd page)
curl "http://localhost:3000/api/products?page=2&limit=10"

# Complex filter: Women's fragrances between 2000-4000, sorted by price
curl "http://localhost:3000/api/products?category=Women&minPrice=2000&maxPrice=4000&sort=price&order=desc"
```

---

### Scenario 3: CRUD Operations Flow

```bash
# 1. Get a product (using example ID)
curl "http://localhost:3000/api/products/65a1b2c3d4e5f6g7h8i9j0k1"

# 2. Update the product
curl -X PUT http://localhost:3000/api/products/65a1b2c3d4e5f6g7h8i9j0k1 \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 45,
    "price": 2599.99
  }'

# 3. Soft delete the product
curl -X DELETE http://localhost:3000/api/products/65a1b2c3d4e5f6g7h8i9j0k1

# 4. Restore the product
curl -X PUT http://localhost:3000/api/products/65a1b2c3d4e5f6g7h8i9j0k1/restore
```

---

## 🔍 Postman Collection Example

### Environment Variables
```json
{
  "base_url": "http://localhost:3000",
  "api_path": "/api/products"
}
```

### Collection Requests

**1. Create Product**
```
POST {{base_url}}{{api_path}}
Content-Type: application/json

{
  "name": "Fragrance Name",
  "description": "Detailed product description minimum 10 characters",
  "price": 2499.99,
  "stock": 50,
  "category": "Men",
  "imageUrl": "https://example.com/image.jpg"
}
```

**2. Get All Products**
```
GET {{base_url}}{{api_path}}
```

**3. Get All Products with Filters**
```
GET {{base_url}}{{api_path}}?category=Men&minPrice=1000&maxPrice=5000&sort=price&order=asc
```

**4. Get Product by ID**
```
GET {{base_url}}{{api_path}}/{{product_id}}
```

**5. Update Product**
```
PUT {{base_url}}{{api_path}}/{{product_id}}
Content-Type: application/json

{
  "stock": 45,
  "price": 2599.99
}
```

**6. Delete Product**
```
DELETE {{base_url}}{{api_path}}/{{product_id}}
```

**7. Restore Product**
```
PUT {{base_url}}{{api_path}}/{{product_id}}/restore
```

---

## ⚠️ Validation Error Examples

### Invalid Product Name (Too Short)
**Request:**
```json
{
  "name": "AB",
  "description": "This is a valid description for testing purposes",
  "price": 1999.99,
  "category": "Men"
}
```

**Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Product name must be at least 3 characters long"
    }
  ]
}
```

---

### Invalid Price (Negative or Zero)
**Request:**
```json
{
  "name": "Fragrance",
  "description": "This is a valid description for testing purposes",
  "price": -100,
  "category": "Men"
}
```

**Response:** `400 Bad Request`
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

---

### Invalid Category
**Request:**
```json
{
  "name": "Fragrance Name",
  "description": "This is a valid description for testing purposes",
  "price": 2499.99,
  "category": "Kids"
}
```

**Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "category",
      "message": "Category must be one of: Men, Women, Unisex"
    }
  ]
}
```

---

### Invalid MongoDB ID
**Request:**
```
GET /api/products/invalid-id-format
```

**Response:** `400 Bad Request`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "id",
      "message": "Invalid product ID format"
    }
  ]
}
```

---

## 📊 Database Schema

```javascript
{
  name: String,              // 3-100 chars, required
  description: String,       // 10-1000 chars, required
  price: Number,            // > 0, required
  stock: Number,            // >= 0, default: 0
  category: String,         // enum: ['Men', 'Women', 'Unisex']
  imageUrl: String,         // optional, must be valid URL
  isActive: Boolean,        // default: true
  createdAt: Date,          // auto-generated
  updatedAt: Date           // auto-updated
}
```

**Indexes:**
- `name` (for search)
- `category` (for filtering)
- `createdAt` (for sorting)

---

## 🚀 Performance Optimization Tips

1. **Use Pagination:** Always paginate large datasets
   ```
   /api/products?page=1&limit=10
   ```

2. **Filter Early:** Use specific filters to reduce database load
   ```
   /api/products?category=Men&minPrice=1000
   ```

3. **Sort Efficiently:** Use indexed fields for sorting
   - `name`, `category`, `createdAt`, `price` are indexed

4. **Cache Results:** Consider caching GET responses in production

---

## 🔐 Security Notes

- **Validation:** All inputs are validated using express-validator
- **Soft Deletes:** Products are soft-deleted (not permanently removed)
- **Error Handling:** Sensitive error details are hidden from clients
- **MongoDB Injection:** Protected by Mongoose schema validation

---

## 📝 Git Commits

Implementation should be tracked with these commits:

```bash
git add .
git commit -m "feat: add product mongoose model"
git commit -m "feat: implement product controller with CRUD operations"
git commit -m "feat: add product validation middleware"
git commit -m "feat: implement product routes"
git commit -m "refactor: add centralized error handling"
```

---

## ✨ Ready for Production

✅ Complete CRUD operations
✅ Input validation
✅ Error handling
✅ Filtering & sorting
✅ Soft deletes
✅ Pagination
✅ Indexes for performance
✅ Clean code architecture
✅ Modular structure
✅ Production-ready

---

**Last Updated:** January 2026
**Status:** Production Ready ✅
