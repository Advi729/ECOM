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
    if (req.body.payment_option === 'cod') {
      const created = await orderHelpers.createOrder(
        productsList,
        totalPrice,
        req.body,
        address
      );
      // console.log('created order:', created);
      if (created) {
        res.json({ status: 'cod' });
      }
    } else if (req.body.payment_option === 'razorPay') {
      const generateOrderId = () => {
        let orderId = '';
        const characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;

        for (let i = 0; i < 10; i++) {
          orderId += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }

        const timestamp = Date.now().toString();
        orderId += timestamp;

        return orderId;
      };

      const orderId = generateOrderId();
      const createdInstance = await orderHelpers.generateRazorPay(
        orderId,
        totalPrice
      );
      if (createdInstance) {
        const created = await orderHelpers.createOrder(
          productsList,
          totalPrice,
          req.body,
          address
        );
        if (created) {
          res.json({ status: 'razorPay', createdInstance });
        }
      }
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// verify payment
const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const onlinePayment = await orderHelpers.verifyRazorpayPayment(req.body);
    if (onlinePayment) {
      const orderId = req.body['order[receipt]'];
      const paymentStatus = 'paid';
      const updated = await orderHelpers.updatePaymentStatus(
        orderId,
        paymentStatus
      );
      if (updated) {
        res.json({ status: true });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

// View all orders
const viewOrders = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const { user } = req.session;
    const userId = user.response._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    const { orderData, totalPages } = await orderHelpers.getOrderDetails(
      userId,
      page
    );
    console.log('totalPages: ', totalPages);
    const orderDetails = JSON.parse(JSON.stringify(orderData));
    // console.log('orderDetails:', orderDetails);
    if (orderDetails) {
      res.render('user/orders', {
        isUser: true,
        user,
        orderDetails,
        cartCount,
        wishlistCount,
        totalPages,
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

// Return order
const returnOrder = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('orderidddddd: ', orderId);
    const returned = await orderHelpers.returnProductOrder(orderId);
    console.log('returned order: ', returned);
    if (returned) res.json({ status: true });
  } catch (error) {
    throw new Error(error);
  }
});

// All orders admin side
const allOrdersAdmin = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const { admin } = req.session;
    const { orderDetails, totalPages } = await orderHelpers.allOrders(page);
    // console.log('allOrdersss: ', allOrders);

    const userData = await Promise.all(
      orderDetails.map(async (order) => {
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

    if (orderDetails) {
      res.render('admin/orders-list', {
        isAdmin: true,
        admin,
        orderDetails,
        userDetails,
        totalPages,
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

// Change order status admin side
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
  verifyPayment,
  viewOrders,
  viewSingleOrder,
  cancelOrder,
  allOrdersAdmin,
  orderDetails,
  changeOrderStatus,
  returnOrder,
};
