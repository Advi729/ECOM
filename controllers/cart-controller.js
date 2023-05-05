const asyncHandler = require('express-async-handler');
const cartHelpers = require('../helpers/cart-helper');
const productHelpers = require('../helpers/product-helper');
const wishlistHelpers = require('../helpers/wishlist-helper');
const orderHelpers = require('../helpers/order-helper');

// Get cart details
const getCart = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req.session;
    const userId = user.response._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    const cartDetails = await cartHelpers.getCartDetails(userId);
    if (cartDetails) {
      const { products, _id } = cartDetails;
      const productDetails = await Promise.all(
        products.map(async (product) => {
          const prod = await productHelpers.findSingleProductId(product.prodId);
          // if (product.quantity >= 2) {
          //   var decrementButton = true;
          // }
          return {
            ...prod,
            quantity: product.quantity,
            cartId: _id,
            subTotal: product.subTotal,
            // eslint-disable-next-line block-scoped-var
            // decrementButton,
          };
        })
      );
      let totalPrice = productDetails.reduce(
        (total, product) => total + product.subTotal,
        0
      );
      totalPrice = parseFloat(totalPrice);
      console.log(`Total Price: ${totalPrice}`);
      const foundProducts = JSON.parse(JSON.stringify(productDetails));
      // console.log('productDetalils:', foundProducts);

      res.render('user/cart', {
        isUser: true,
        user,
        cartDetails,
        foundProducts,
        cartCount,
        wishlistCount,
        totalPrice,
      });
    } else {
      res.render('user/cart', {
        isUser: true,
        user,
        wishlistCount,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Add to Cart
const addToCart = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.session;
    const userId = user.response._id;
    const prod = await productHelpers.findSingleProductId(id);
    const foundProduct = JSON.parse(JSON.stringify(prod));

    // console.log('addedProduct:', foundProduct);
    let finalPrice;
    if (foundProduct.discountPrice === 0) {
      finalPrice = foundProduct.price;
    } else {
      finalPrice = foundProduct.discountPrice;
    }
    const added = await cartHelpers.addProductToCart(userId, id, finalPrice);

    if (added) {
      // console.log('addeddddd:', added);
      res.json({ status: true });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Remove product from cart
const removeProductFromCart = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req.session;
    const userId = user.response._id;
    const removed = await cartHelpers.removeFromCart(userId, id);
    if (removed) {
      // res.redirect('/cart');
      res.json({ status: true });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Clear cart
const clearCartProducts = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req.session;
    const userId = user.response._id;
    const cleared = await cartHelpers.clearedCart(userId);
    if (cleared) {
      // res.redirect('/cart');
      res.json({ status: true });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Change product quantity
const changeProductQuantity = asyncHandler(async (req, res, next) => {
  try {
    console.log('req.body', req.body);
    const { prodId } = req.body;
    const product = await productHelpers.findSingleProductId(prodId);
    const totalStock = product.stock;
    const changed = await cartHelpers.changeTheQuantity(req.body, totalStock);
    const changedQty = JSON.parse(JSON.stringify(changed));
    console.log('changedQQQ:', changedQty);
    res.json({ changedQty });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Delete cart after order is placed
const deleteCart = asyncHandler(async (req, res, next) => {
  try {
    const { orderId } = req.body;
    console.log('orderId in deletecart: ', orderId);
    const { user } = req.session;
    const userId = user.response._id;
    const deleted = await cartHelpers.deleteTheCart(userId);
    const deletedOrder = await orderHelpers.deleteTheOrder(orderId);
    if (deleted && deletedOrder) res.json({ status: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = {
  getCart,
  addToCart,
  removeProductFromCart,
  clearCartProducts,
  changeProductQuantity,
  deleteCart,
};
