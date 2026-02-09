import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Product ID is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Product quantity is required'],
          min: [1, 'Quantity must be at least 1'],
          validate: {
            validator: function (v) {
              return Number.isInteger(v);
            },
            message: 'Quantity must be an integer',
          },
        },
        price: {
          type: Number,
          required: [true, 'Product price at order time is required'],
          min: [0, 'Price cannot be negative'],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, 'Total order amount is required'],
      min: [0.01, 'Total amount must be greater than 0'],
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: 'Total amount must be greater than 0',
      },
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'shipped', 'delivered'],
        message: 'Status must be one of: pending, confirmed, shipped, delivered',
      },
      default: 'pending',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Validate products array is not empty
orderSchema.pre('save', function (next) {
  if (!this.products || this.products.length === 0) {
    const error = new Error('Order must contain at least one product');
    error.statusCode = 400;
    return next(error);
  }
  next();
});

// Create indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export default mongoose.model('Order', orderSchema);
