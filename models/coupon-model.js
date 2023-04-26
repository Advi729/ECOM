const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    // discountType: {
    //   type: String,
    //   enum: ['percentage', 'fixed'],
    //   required: true,
    // },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    // discountAmount: {
    //   type: Number,
    //   required: true,
    // },
    minimumPurchase: {
      type: Number,
      required: true,
    },
    maximumUse: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    // eligible: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Coupon', couponSchema);
