const mongoose = require('mongoose');
const User = require('./user-model');
const Product = require('./product-model');

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  products: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    unique: true,
  }
});

module.exports = mongoose.model('Wishlist', wishlistSchema);
