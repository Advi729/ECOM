const asyncHandler = require('express-async-handler');
const cartHelpers = require('../helpers/cart-helper');
const productHelpers = require('../helpers/product-helper');
const userHelpers = require('../helpers/user-helper');
const orderHelpers = require('../helpers/order-helper');
const wishlistHelpers = require('../helpers/wishlist-helper');
const User = require('../models/user-model');

// Proceed to checkout
const checkOutCart = asyncHandler(async (req, res) => {
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

    const { products, _id } = cartDetails;
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const prod = await productHelpers.findSingleProductId(product.prodId);
        return {
          ...prod,
          quantity: product.quantity,
          cartId: _id,
          subTotal: product.subTotal,
        };
      })
    );
    let totalPrice = productDetails.reduce(
      (total, product) => total + product.subTotal,
      0
    );
    totalPrice = parseFloat(totalPrice);
    const foundProducts = JSON.parse(JSON.stringify(productDetails));

    const resultUser = await userHelpers.findUser(userId);
    const finalUser = JSON.parse(JSON.stringify(resultUser));

    res.render('user/checkout', {
      user,
      isUser: true,
      cartCount,
      wishlistCount,
      foundProducts,
      totalPrice,
      finalUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Get total price
const getTotalPrice = asyncHandler(async (products) => {
  try {
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const prod = await productHelpers.findSingleProductId(product.prodId);
        return {
          ...prod,
          quantity: product.quantity,
          subTotal: product.subTotal,
        };
      })
    );
    let totalPrice = productDetails.reduce(
      (total, product) => total + product.subTotal,
      0
    );
    totalPrice = parseFloat(totalPrice);
    return totalPrice;
    // const foundProducts = JSON.parse(JSON.stringify(productDetails));
  } catch (error) {
    throw new Error(error);
  }
});

const placeOrder = asyncHandler(async (req, res) => {
  try {
    const { userId, deliveryAddress } = req.body;
    const cart = await cartHelpers.getCartDetails(userId);
    const productsList = cart.products;
    const totalPrice = await getTotalPrice(productsList);
    const address = await userHelpers.getDeliveryAddress(
      userId,
      deliveryAddress
    );
    const created = await orderHelpers.createOrder(
      productsList,
      totalPrice,
      req.body,
      address
    );
    // console.log('created order:', created);
    if (created) {
      res.json({ status: true });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// View all orders
const viewOrders = asyncHandler(async (req, res) => {
  try {
    const { user } = req.session;
    const userId = user.response._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    const orderData = await orderHelpers.getOrderDetails(userId);
    const orderDetails = JSON.parse(JSON.stringify(orderData));
    console.log('orderDetails:', orderDetails);
    if (orderDetails) {
      res.render('user/orders', {
        isUser: true,
        user,
        orderDetails,
        cartCount,
        wishlistCount,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// View single order details
const viewSingleOrder = asyncHandler(async (req, res) => {
  try {
    const { user } = req.session;
    const { orderId } = req.query;
    const userId = user.response._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    const orderData = await orderHelpers.getSingleOrderDetails(orderId);
    const orderDetails = JSON.parse(JSON.stringify(orderData));
    const { products } = orderDetails;
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const prod = await productHelpers.findSingleProductId(product.prodId);
        return {
          ...prod,
          quantity: product.quantity,
          subTotal: product.subTotal,
        };
      })
    );
    let totalPrice = productDetails.reduce(
      (total, product) => total + product.subTotal,
      0
    );
    totalPrice = parseFloat(totalPrice);
    const foundProducts = JSON.parse(JSON.stringify(productDetails));

    res.render('user/order-details', {
      user,
      isUser: true,
      cartCount,
      wishlistCount,
      orderDetails,
      foundProducts,
      totalPrice,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const orderId = id;
    const cancelled = await orderHelpers.cancelProductOrder(orderId);
    if (cancelled) res.json({ status: true });
  } catch (error) {
    throw new Error(error);
  }
});

// All orders admin side
const allOrdersAdmin = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const allOrders = await orderHelpers.allOrders();
    // console.log('allOrdersss: ', allOrders);

    const userData = await Promise.all(
      allOrders.map(async (order) => {
        const user = await User.findById(order.userId);
        return {
          user,
          totalPrice: order.totalPrice,
          orderStatus: order.orderStatus,
          paymentMethod: order.paymentMethod,
          orderId: order.orderId,
          createdAt: order.createdAt,
        };
      })
    );
    const userDetails = JSON.parse(JSON.stringify(userData));
    // console.log('userDetails: ', userDetails);

    if (allOrders) {
      res.render('admin/orders-list', {
        isAdmin: true,
        admin,
        allOrders,
        userDetails,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Order details
const orderDetails = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const { orderId } = req.params;
    const orderData = await orderHelpers.getSingleOrderDetails(orderId);
    const userData = await userHelpers.findUser(orderData.userId);

    const { products } = orderData;
    const productDetails = await Promise.all(
      products.map(async (product) => {
        const prod = await productHelpers.findSingleProductId(product.prodId);
        return {
          ...prod,
          quantity: product.quantity,
          subTotal: product.subTotal,
        };
      })
    );
    const foundProducts = JSON.parse(JSON.stringify(productDetails));
    // console.log('orderData', orderData);
    // console.log('userrData', userData);
    // console.log('foundProductsData', foundProducts);
    res.render('admin/order-details', {
      isAdmin: true,
      admin,
      orderData,
      userData,
      foundProducts,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Change order status
const changeOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderStatus, orderId } = req.body;
    const updated = await orderHelpers.updateOrderStatus(orderId, orderStatus);
    if (updated) res.json({ status: true });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  checkOutCart,
  placeOrder,
  viewOrders,
  viewSingleOrder,
  cancelOrder,
  allOrdersAdmin,
  orderDetails,
  changeOrderStatus,
};
