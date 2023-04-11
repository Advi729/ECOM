const mongoose = require('mongoose');
const User = require('./user-model');
const Product = require('./product-model');

// Declare the Cart Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // products: {
    //   type: [],
    //   default: [],
    // },
    products: [
      {
        // productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        prodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, default: 1 },
        subTotal: { type: Number },
      },
    ],
    totalPrice: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model('Cart', cartSchema);
