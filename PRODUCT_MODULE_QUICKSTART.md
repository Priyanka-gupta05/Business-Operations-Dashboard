# Product Management Module - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Verify Installation

Ensure these packages are installed:
```bash
npm list express mongoose express-validator
```

If missing:
```bash
npm install express mongoose express-validator dotenv
```

### Step 2: Verify Environment

Check your `.env` file:
```
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.mongodb.net/roms
NODE_ENV=development
PORT=3000
```

### Step 3: Start Server

```bash
npm start
# or
node server.js
```

You should see:
```
Server is running on port 3000
Connected to MongoDB
```

### Step 4: Test Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🎯 Essential API Calls

### Create Your First Product

```bash
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
```

### Get All Products

```bash
curl http://localhost:3000/api/products
```

### Filter by Category

```bash
curl "http://localhost:3000/api/products?category=Men"
```

### Filter by Price Range

```bash
curl "http://localhost:3000/api/products?minPrice=1000&maxPrice=5000"
```

### Sort by Price (Ascending)

```bash
curl "http://localhost:3000/api/products?sort=price&order=asc"
```

### Pagination

```bash
curl "http://localhost:3000/api/products?page=1&limit=10"
```

---

## 📋 Common Combinations

### Get Men's Products Sorted by Price

```bash
curl "http://localhost:3000/api/products?category=Men&sort=price&order=asc"
```

### Get Premium Products (Price > 5000) with Pagination

```bash
curl "http://localhost:3000/api/products?minPrice=5000&sort=price&order=desc&page=1&limit=5"
```

### Get All Women's Products in Price Range

```bash
curl "http://localhost:3000/api/products?category=Women&minPrice=2000&maxPrice=4000"
```

---

## 🔧 Update & Delete Operations

### Update Product Stock

Replace `PRODUCT_ID` with actual ID:
```bash
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 30
  }'
```

### Soft Delete Product

```bash
curl -X DELETE http://localhost:3000/api/products/PRODUCT_ID
```

### Restore Deleted Product

```bash
curl -X PUT http://localhost:3000/api/products/PRODUCT_ID/restore
```

---

## 📱 Using Postman

### 1. Create Environment

Create a new environment with variable:
```
base_url = http://localhost:3000
```

### 2. Create Requests

**Create Product:**
```
POST {{base_url}}/api/products
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product description minimum 10 characters",
  "price": 2499.99,
  "stock": 50,
  "category": "Men",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Get All:**
```
GET {{base_url}}/api/products
```

**Get By Category:**
```
GET {{base_url}}/api/products?category=Men
```

**Get By ID:**
```
GET {{base_url}}/api/products/{{product_id}}
```

**Update:**
```
PUT {{base_url}}/api/products/{{product_id}}
Content-Type: application/json

{
  "stock": 25
}
```

**Delete:**
```
DELETE {{base_url}}/api/products/{{product_id}}
```

---

## ✅ Validation Quick Reference

### Required Fields
- `name` ✓
- `description` ✓
- `price` ✓
- `category` ✓

### Optional Fields
- `stock` (defaults to 0)
- `imageUrl`
- `isActive` (defaults to true)

### Field Constraints

| Field | Min | Max | Type |
|-------|-----|-----|------|
| name | 3 chars | 100 chars | String |
| description | 10 chars | 1000 chars | String |
| price | 0.01 | unlimited | Number |
| stock | 0 | unlimited | Integer |
| category | N/A | N/A | Enum: Men, Women, Unisex |
| imageUrl | N/A | N/A | Valid URL |

---

## 🐛 Common Errors & Solutions

### "Product name is required"
✅ Solution: Add `name` field with minimum 3 characters

### "Product price must be a number greater than 0"
✅ Solution: Ensure `price` is a number and > 0

### "Category must be one of: Men, Women, Unisex"
✅ Solution: Use exact spelling and capitalization

### "Invalid product ID format"
✅ Solution: Use a valid MongoDB ObjectId (24 hex characters)

### "Product not found"
✅ Solution: Verify the product ID exists and is active

---

## 📊 Sample Data for Testing

```javascript
// Men's Fragrances
{
  "name": "Dior Sauvage",
  "description": "A luxurious fragrance with notes of ambroxan and spice, perfect for the modern man. This sophisticated perfume combines fresh citrus with warm spice notes for an unforgettable scent experience.",
  "price": 2499.99,
  "stock": 50,
  "category": "Men",
  "imageUrl": "https://example.com/images/dior-sauvage.jpg"
}

// Women's Fragrances
{
  "name": "Chanel No. 5",
  "description": "An iconic fragrance with timeless elegance and luxury notes that define feminine grace and sophistication. This classic scent features a blend of aldehydes and florals creating an unforgettable impression.",
  "price": 3299.99,
  "stock": 30,
  "category": "Women",
  "imageUrl": "https://example.com/images/chanel-5.jpg"
}

// Unisex Fragrances
{
  "name": "Jo Malone Wood Sage & Sea Salt",
  "description": "A fresh unisex fragrance combining marine notes with earthy sage and mineral nuances. This light and airy scent is perfect for any occasion and appeals to diverse preferences.",
  "price": 1999.99,
  "stock": 75,
  "category": "Unisex",
  "imageUrl": "https://example.com/images/jomalone.jpg"
}
```

---

## 🔗 File Reference

| File | Purpose |
|------|---------|
| `src/models/Product.js` | MongoDB schema definition |
| `src/controllers/product.controller.js` | Business logic |
| `src/routes/product.routes.js` | API endpoints |
| `src/middleware/validateProduct.js` | Input validation |
| `src/utils/apiFeatures.js` | Filtering & sorting |
| `app.js` | Main app file (updated) |

---

## 🎓 Learning Path

1. ✅ **Understand the Routes** → Read `src/routes/product.routes.js`
2. ✅ **Review the Model** → Check `src/models/Product.js`
3. ✅ **Study the Controller** → Explore `src/controllers/product.controller.js`
4. ✅ **Test API Calls** → Use curl or Postman
5. ✅ **Read Full Docs** → See `PRODUCT_MODULE_DOCUMENTATION.md`

---

## 🆘 Need Help?

### Check the Full Documentation
📖 See `PRODUCT_MODULE_DOCUMENTATION.md`

### Check Testing Guide
🧪 See `PRODUCT_MODULE_TESTING.md`

### Check Database Connection
```bash
# Verify MongoDB is running
# Check connection string in .env
# Verify network connectivity
```

### Check Server Logs
```bash
# Look for errors in console output
# Check error handler responses
```

---

## ✨ Next Steps

After getting comfortable with the module:

1. **Add Authentication** - Protect endpoints with JWT
2. **Add Pagination UI** - Build frontend integration
3. **Add Analytics** - Track product views and sales
4. **Add Reviews** - Let customers rate products
5. **Add Inventory Alerts** - Notify when stock is low

---

## 🎉 You're All Set!

Your Product Management Module is ready to use.

**Next:** Test the API using the examples above! 🚀

---

**Quick Links:**
- Full Testing Guide: [PRODUCT_MODULE_TESTING.md](PRODUCT_MODULE_TESTING.md)
- Full Documentation: [PRODUCT_MODULE_DOCUMENTATION.md](PRODUCT_MODULE_DOCUMENTATION.md)
- Health Check: `GET /health`
- Products API: `GET /api/products`

---

*Last Updated: January 2026*
*Status: ✅ Ready to Use*
