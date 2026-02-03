import Product from '../models/Product.js';
import APIFeatures from '../utils/apiFeatures.js';

/**
 * Create a new product
 * POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    // Create new product instance
    const newProduct = await Product.create({
      name,
      description,
      price,
      stock: stock || 0,
      category,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products with filtering and sorting
 * GET /api/products
 * Query parameters: category, minPrice, maxPrice, sort, order, page, limit
 */
export const getAllProducts = async (req, res, next) => {
  try {
    // Only fetch active products by default
    const features = new APIFeatures(
      Product.find({ isActive: true }),
      req.query
    );

    features.filter().sort().paginate();

    const products = await features.query;

    // Get total count for pagination info
    const totalProducts = await Product.countDocuments({ isActive: true });

    return res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single product by ID
 * GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a product
 * PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update product
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete a product (set isActive to false)
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all products (including inactive ones) - Admin only
 * GET /api/products/admin/all
 */
export const getAllProductsAdmin = async (req, res, next) => {
  try {
    // Fetch all products (active and inactive)
    const features = new APIFeatures(Product.find(), req.query);

    features.filter().sort().paginate();

    const products = await features.query;

    const totalProducts = await Product.countDocuments();

    return res.status(200).json({
      success: true,
      count: products.length,
      total: totalProducts,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Restore a deleted product (set isActive to true)
 * PUT /api/products/:id/restore
 */
export const restoreProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Product restored successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
