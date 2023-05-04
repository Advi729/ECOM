const asyncHandler = require('express-async-handler');
const cartHelpers = require('../helpers/cart-helper');
const wishlistHelpers = require('../helpers/wishlist-helper');
const productHelpers = require('../helpers/product-helper');

// Get the wishlist page
const getWishlist = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req.session;
    const userId = user.response._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    const wishlistData = await wishlistHelpers.getWishlistDetails(userId);
    const wishlistDetails = JSON.parse(JSON.stringify(wishlistData));
    const { products } = wishlistDetails;

    const productDetails = await Promise.all(
      products.map(async (prodId) => {
        const prod = await productHelpers.findSingleProductId(prodId);
        return prod;
      })
    );
    const foundProducts = JSON.parse(JSON.stringify(productDetails));
console.log(foundProducts);
    res.render('user/wishlist', {
      user,
      isUser: true,
      cartCount,
      wishlistCount,
      foundProducts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Add product to wishlist
const addToWishlist = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req.session;
    const { id } = req.params;
    const userId = user.response._id;
    const productId = id;
    const added = wishlistHelpers.addProductToWishlist(userId, productId);
    if (added) res.json({ status: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Remove product from wishlist
const removeFromWishlist = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req.session;
    const { id } = req.params;
    const userId = user.response._id;
    const productId = id;
    const removed = wishlistHelpers.removeProductFromWishlist(
      userId,
      productId
    );
    if (removed) res.json({ status: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
