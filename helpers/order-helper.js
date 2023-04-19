const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const Order = require('../models/order-model');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const productHelpers = require('./product-helper');

const instance = new Razorpay({
  key_id: 'rzp_test_unePQlLuDT2Zxm',
  key_secret: 'Qrv55Iyw8yIfTZMR8plnQBTa',
});

// update quantity in product schema after ordering
const updateProductQuantity = asyncHandler(async (productsList) => {
  try {
    await Promise.all(
      productsList.map(async (product) => {
        const { quantity } = product;
        await productHelpers.updateProductQuantity(product.prodId, quantity);
      })
    );
  } catch (error) {
    throw new Error(error);
  }
});

// Create order
const createOrder = asyncHandler(
  async (productsList, totalPrice, order, address) => {
    try {
      // console.log('productsList:', productsList);
      // console.log('totalPrice:', totalPrice);
      // console.log('body:', order);
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

      const status = order.payment_option === 'cod' ? 'placed' : 'pending';
      const payStatus = order.payment_option === 'cod' ? 'pending' : 'paid';

      const newOrder = new Order({
        orderId: generateOrderId(),
        userId: order.userId,
        deliveryDetails: address,
        paymentMethod: order.payment_option,
        products: productsList,
        orderStatus: status,
        paymentStatus: payStatus,
        totalPrice,
      });
      await newOrder.save();

      // update the quantity of products
      await updateProductQuantity(productsList);

      // Delete the cart after placing order
      await Cart.deleteOne({ userId: order.userId });

      if (newOrder) {
        return newOrder;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
);

// Get all order details of a user
const getOrderDetails = asyncHandler(async (userId, page) => {
  try {
    const limit = 9;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments({ userId });
    const totalPages = Math.ceil(totalOrders / limit);

    console.log('total orders: ', totalOrders);
    console.log('total pages: ', totalPages);

    const orderData = await Order.find({ userId }).skip(skip).limit(limit);

    return { orderData, totalPages };
  } catch (error) {
    throw new Error(error);
  }
});

// Get a single order details
const getSingleOrderDetails = asyncHandler(async (orderId) => {
  try {
    const singleOrderData = await Order.findOne({ orderId });
    const singleOrderDetails = JSON.parse(JSON.stringify(singleOrderData));
    return singleOrderDetails;
  } catch (error) {
    throw new Error(error);
  }
});

// Cancel order
const cancelProductOrder = asyncHandler(async (orderId) => {
  try {
    const newStatus = 'cancelled';
    let paymentStatus;
    const orderDetails = await Order.findOne({ orderId });
    if (orderDetails.paymentStatus === 'paid') {
      paymentStatus = 'return';
    } else if (orderDetails.paymentStatus === 'pending') {
      paymentStatus = 'cancelled';
    } else if (orderDetails.paymentStatus === 'cancelled') {
      paymentStatus = 'cancelled';
    }

    const cancelled = await Order.updateOne(
      { orderId },
      { $set: { orderStatus: newStatus, paymentStatus } }
    );
    if (cancelled) return cancelled;
  } catch (error) {
    throw new Error(error);
  }
});

// Return order
const returnProductOrder = asyncHandler(async (orderId) => {
  try {
    const newStatus = 'return';
    let paymentStatus;
    const orderDetails = await Order.findOne({ orderId });
    if (orderDetails.paymentStatus === 'paid') {
      paymentStatus = 'return';
    } else if (orderDetails.paymentStatus === 'pending') {
      paymentStatus = 'pending';
    } else if (orderDetails.paymentStatus === 'cancelled') {
      paymentStatus = 'cancelled';
    }
    const returned = await Order.updateOne(
      { orderId },
      { $set: { orderStatus: newStatus, paymentStatus } }
    );
    if (returned) return returned;
  } catch (error) {
    // throw new Error(error);
    console.error(error);
  }
});

// All order details
const allOrders = asyncHandler(async (page) => {
  try {
    const limit = 9;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments();

    const orderData = await Order.find().skip(skip).limit(limit);
    const orderDetails = JSON.parse(JSON.stringify(orderData));
    const totalPages = Math.ceil(totalOrders / limit);

    return { orderDetails, totalPages };
  } catch (error) {
    throw new Error(error);
  }
});

// Update the order status
const updateOrderStatus = asyncHandler(async (orderId, orderStatus) => {
  try {
    const updated = await Order.updateOne(
      { orderId },
      { $set: { orderStatus } }
    );
    if (updated) return updated;
  } catch (error) {
    throw new Error(error);
  }
});

// Razorpay
const generateRazorPay = asyncHandler(async (orderId, totalPrice) => {
  try {
    const createdInstance = await instance.orders.create({
      amount: totalPrice * 100,
      currency: 'INR',
      receipt: orderId,
    });
    return createdInstance;
  } catch (error) {
    throw new Error(error);
  }
});

// Verify the payment
const verifyRazorpayPayment = asyncHandler(async (details) => {
  try {
    const crypto = require('crypto');
    let hmac = crypto.createHmac('sha256', 'Qrv55Iyw8yIfTZMR8plnQBTa');

    hmac.update(
      `${details['payment[razorpay_order_id]']}|${details['payment[razorpay_payment_id]']}`
    );
    hmac = hmac.digest('hex');
    if (hmac === details['payment[razorpay_signature]']) {
      return true;
    }
    return false;
  } catch (error) {
    throw new Error(error);
  }
});

// Update the payment status
const updatePaymentStatus = asyncHandler(async (orderId, paymentStatus) => {
  try {
    const updated = await Order.updateOne(
      { orderId },
      { $set: { paymentStatus } }
    );
    if (updated) return updated;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createOrder,
  getOrderDetails,
  getSingleOrderDetails,
  cancelProductOrder,
  allOrders,
  updateOrderStatus,
  generateRazorPay,
  verifyRazorpayPayment,
  updatePaymentStatus,
  returnProductOrder,
};
