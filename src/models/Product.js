import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [3, 'Product name must be at least 3 characters long'],
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      minlength: [10, 'Product description must be at least 10 characters long'],
      maxlength: [1000, 'Product description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0.01, 'Product price must be greater than 0'],
      validate: {
        validator: function (v) {
          return v > 0;
        },
        message: 'Product price must be greater than 0',
      },
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative'],
      validate: {
        validator: function (v) {
          return Number.isInteger(v);
        },
        message: 'Stock must be an integer',
      },
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: ['Men', 'Women', 'Unisex'],
        message: 'Category must be one of: Men, Women, Unisex',
      },
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Adds updatedAt automatically
  }
);

// Create indexes for better query performance
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });

export default mongoose.model('Product', productSchema);
