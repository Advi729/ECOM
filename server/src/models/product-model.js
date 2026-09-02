const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: 2,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      maxlength: 5000,
    },

    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },

    discountPrice: {
      type: Number,
      default: null,
      min: [0, 'Discount price cannot be negative'],
    },

    discountPrice: {
      type: Number,
      default: null,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator(value) {
          return value === null || value <= this.price;
        },
        message: 'Discount price cannot be greater than the original price',
      },
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },

    subCategory: {
      type: String,
      trim: true,
      default: null,
    },

    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
      index: true,
    },

    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate slug before saving
productSchema.pre('validate', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  // next();
});

module.exports = mongoose.model('Product', productSchema);