const mongoose = require('mongoose');
const User = require('./user-model');

// Declare the Order schema of the Mongo model
const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      // required: true,
      unique: true,
    },
    deliveryDetails: {
      type: Object,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    products: {
      type: Object,
      required: true,
    },
    paymentStatus: {
      type: String,
      default: 'pending',
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    grandTotalPrice: {
      type: Number,
    },
    couponPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    returnReason: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
