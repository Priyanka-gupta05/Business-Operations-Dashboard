import Product from '../models/Product.js';

/**
 * Get all products
 * @route   GET /api/products
 * @desc    Fetch all products with optional filtering
 * @access  Public
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (status) {
      filter.status = status;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
      length: products.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product by ID
 * @route   GET /api/products/:id
 * @desc    Fetch a single product by ID
 * @access  Public
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new product
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Public (should be Protected)
 */
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, imageUrl, status } =
      req.body;

    // Validation
    if (!name || !price || !stock || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide required fields: name, price, stock, category',
      });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      imageUrl,
      status: status || 'active',
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a product
 * @route   PUT /api/products/:id
 * @desc    Update a product by ID
 * @access  Public (should be Protected)
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, stock, category, imageUrl, status } =
      req.body;

    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Update fields if provided
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (category !== undefined) product.category = category;
    if (imageUrl !== undefined) product.imageUrl = imageUrl;
    if (status !== undefined) product.status = status;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a product
 * @route   DELETE /api/products/:id
 * @desc    Delete a product by ID
 * @access  Public (should be Protected)
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
