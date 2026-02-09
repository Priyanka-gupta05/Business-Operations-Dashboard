import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Create a new order
 * POST /api/orders
 * Access: Protected (authenticated users)
 */
export const createOrder = async (req, res, next) => {
  try {
    const { products } = req.body;
    const userId = req.user.id;

    // Validate products array
    if (!products || !Array.isArray(products) || products.length === 0) {
      const error = new Error('Products array is required and must contain at least one item');
      error.statusCode = 400;
      return next(error);
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    let totalAmount = 0;
    const processedProducts = [];

    // Process each product: validate existence, stock, and calculate price
    for (const item of products) {
      const { product: productId, quantity } = item;

      // Validate quantity
      if (!quantity || quantity < 1) {
        const error = new Error('Product quantity must be at least 1');
        error.statusCode = 400;
        return next(error);
      }

      // Fetch product
      const product = await Product.findById(productId);

      // Check if product exists
      if (!product) {
        const error = new Error(`Product with ID ${productId} not found`);
        error.statusCode = 404;
        return next(error);
      }

      // Check if product is active
      if (!product.isActive) {
        const error = new Error(`Product ${product.name} is not available for ordering`);
        error.statusCode = 400;
        return next(error);
      }

      // Check stock availability
      if (product.stock < quantity) {
        const error = new Error(
          `Insufficient stock for product ${product.name}. Available: ${product.stock}, Requested: ${quantity}`
        );
        error.statusCode = 400;
        return next(error);
      }

      // Calculate amount for this product
      const itemTotal = product.price * quantity;
      totalAmount += itemTotal;

      // Store product data for order
      processedProducts.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }

    // Validate totalAmount
    if (totalAmount <= 0) {
      const error = new Error('Total amount must be greater than 0');
      error.statusCode = 400;
      return next(error);
    }

    // Create order object
    const newOrder = new Order({
      user: userId,
      products: processedProducts,
      totalAmount,
      status: 'pending',
    });

    // Save order
    const savedOrder = await newOrder.save();

    // Reduce stock for each product
    for (const item of products) {
      const { product: productId, quantity } = item;
      await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -quantity } },
        { new: true, runValidators: true }
      );
    }

    // Populate user and products
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('user', 'name email')
      .populate('products.product', 'name price category');

    return res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get all orders
 * GET /api/orders
 * Access: Admin only
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price category')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single order by ID
 * GET /api/orders/:id
 * Access: Admin or order owner
 */
export const getSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error('Invalid Order ID format');
      error.statusCode = 400;
      return next(error);
    }

    const order = await Order.findById(id)
      .populate('user', 'name email')
      .populate('products.product', 'name price category');

    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    // Check authorization: admin or order owner
    const isAdmin = req.user.role === 'admin';
    const isOwner = order.user._id.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      const error = new Error('Not authorized to view this order');
      error.statusCode = 403;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status
 * PUT /api/orders/:id/status
 * Access: Admin only
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      const error = new Error('Invalid Order ID format');
      error.statusCode = 400;
      return next(error);
    }

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered'];
    if (!status || !validStatuses.includes(status)) {
      const error = new Error(`Status must be one of: ${validStatuses.join(', ')}`);
      error.statusCode = 400;
      return next(error);
    }

    // Find and update order
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('products.product', 'name price category');

    if (!updatedOrder) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      return next(error);
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
