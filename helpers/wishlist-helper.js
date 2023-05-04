const asyncHandler = require('express-async-handler');
const Wishlist = require('../models/wishlist-model');

// Get all details of a wishlist
const getWishlistDetails = asyncHandler(async (userId) => {
  try {
    const wishlistDetails = await Wishlist.findOne({ userId });
    return wishlistDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Add product to wishlist
const addProductToWishlist = asyncHandler(async (userId, productId) => {
  try {
    const wishlistAdded = await Wishlist.findOne({ userId });
    if (!wishlistAdded) {
      // Create a new document with userId and the new product id
      const newWishlist = new Wishlist({
        userId,
        products: [productId],
      });
      await newWishlist.save();
      return newWishlist;
    }
    const updated = await Wishlist.updateOne(
      { userId },
      {
        $addToSet: { products: productId },
      }
    );
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Get wishlist count
const getWishlistCount = asyncHandler(async (userId) => {
  try {
    const wishlistDetails = await Wishlist.findOne({ userId });
    if (wishlistDetails) {
      const count = wishlistDetails.products.length;
      return count;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Remove products from wishlist
const removeProductFromWishlist = asyncHandler(async (userId, productId) => {
  try {
    const removed = Wishlist.updateOne(
      { userId },
      { $pull: { products: productId } }
    );
    if (removed) return removed;
  } catch (error) {
    console.error(error);
    throw error;
  }
});
module.exports = {
  getWishlistDetails,
  addProductToWishlist,
  getWishlistCount,
  removeProductFromWishlist,
};
