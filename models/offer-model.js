const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    subCategory: {
      type: String,
      required: true,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Offer', offerSchema);
