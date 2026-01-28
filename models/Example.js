import mongoose from 'mongoose';

/**
 * Example Model Template
 * Replace "Example" with your actual model name
 */
const exampleSchema = new mongoose.Schema(
  {
    // Define your fields here
    // Example fields:
    // name: {
    //   type: String,
    //   required: [true, 'Please provide a name'],
    //   trim: true,
    //   maxlength: [50, 'Name cannot exceed 50 characters'],
    // },
    // email: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   lowercase: true,
    // },
    // status: {
    //   type: String,
    //   enum: ['active', 'inactive'],
    //   default: 'active',
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Add indexes if needed
// exampleSchema.index({ email: 1 });

const Example = mongoose.model('Example', exampleSchema);

export default Example;
