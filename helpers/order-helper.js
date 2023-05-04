const asyncHandler = require('express-async-handler');
const Razorpay = require('razorpay');
const Order = require('../models/order-model');
const Wallet = require('../models/wallet-model');
const Cart = require('../models/cart-model');
const User = require('../models/user-model');
const Product = require('../models/product-model');
const productHelpers = require('./product-helper');
const couponHelpers = require('./coupon-helper');
const userHelpers = require('./user-helper');

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
    console.error(error);
    throw error;
  }
});

// Update coupon details in user schema
const updateCouponDetails = asyncHandler(async (userId, coupon) => {
  try {
    console.log('userId: ', userId);
    console.log('couponDeta: ', coupon.code);
    const user = await User.findById(userId);
    const couponObj = {
      code: coupon.code,
      timesUsed: 1,
    };
    const existingCouponIndex = user.coupons.findIndex(
      (c) => c.code == coupon.code
    );
    console.log('existing: ', existingCouponIndex);
    if (existingCouponIndex !== -1) {
      // Coupon already exists, increment timesUsed property
      // user.coupons[existingCouponIndex].timesUsed++;
      const updated = await User.updateOne(
        { _id: userId, 'coupons.code': coupon.code },
        { $inc: { 'coupons.$.timesUsed': 1 } }
      );
      return updated;
    }
    // Coupon doesn't exist, add a new coupon object to user's coupons array
    // user.coupons.push(couponObj);
    const updated = await User.updateOne(
      { _id: userId },
      // { $push: { coupons: { $each: [couponObj] } } }
      { $push: { coupons: couponObj } },
      { new: true }
    );
    // const updated = await user.save();
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Create order
const createOrder = asyncHandler(
  async (
    productsList,
    totalPrice,
    grandTotalPrice,
    order,
    address,
    userId,
    coupon
  ) => {
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

      let couponPercentage;
      if (coupon) {
        couponPercentage = coupon.discountPercentage;
      }
      const newOrder = new Order({
        orderId: generateOrderId(),
        userId: order.userId,
        deliveryDetails: address,
        paymentMethod: order.payment_option,
        products: productsList,
        orderStatus: status,
        paymentStatus: payStatus,
        totalPrice,
        grandTotalPrice,
        couponPercentage,
        returnReason: null,
      });
      await newOrder.save();

      // update the quantity of products
      await updateProductQuantity(productsList);

      // Delete the cart after placing order
      // await Cart.deleteOne({ userId: order.userId });

      if (newOrder) {
        if (coupon) {
          // update coupon details in user schema
          await updateCouponDetails(userId, coupon);
        }
        return newOrder;
      }
    } catch (error) {
      console.error(error);
      throw error;
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

    // console.log('total orders: ', totalOrders);
    // console.log('total pages: ', totalPages);

    const orderData = await Order.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { orderData, totalPages };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Get a single order details
const getSingleOrderDetails = asyncHandler(async (orderId) => {
  try {
    const singleOrderData = await Order.findOne({ orderId });
    const singleOrderDetails = JSON.parse(JSON.stringify(singleOrderData));
    return singleOrderDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Give refund if order cancelled or returned
const giveRefund = asyncHandler(async (order) => {
  try {
    const { userId } = order;
    const amount = parseFloat(order.totalPrice);
    const transaction = {
      orderId: order.orderId,
      amount,
      date: new Date(),
    };
    const walletExisting = await Wallet.findOne({ userId });
    if (walletExisting) {
      walletExisting.balance += amount;
      walletExisting.transactions.push(transaction);
      await walletExisting.save();
      return walletExisting;
    }
    const walletNew = new Wallet({
      userId,
      balance: amount,
      transactions: [transaction],
    });
    await walletNew.save();
    return walletNew;
  } catch (error) {
    console.error(error);
    throw error;
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
    if (orderDetails.paymentMethod !== 'cod') {
      const refunded = await giveRefund(orderDetails);
      if (cancelled && refunded) return cancelled;
    }
    if (cancelled) return cancelled;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Return order
const returnProductOrder = asyncHandler(async (orderId, returnReason) => {
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
      { $set: { orderStatus: newStatus, paymentStatus, returnReason } }
    );

    // if (orderDetails.paymentMethod !== 'cod') {
    const refunded = await giveRefund(orderDetails);
    if (returned && refunded) return returned;
    // }
    // if (returned) return returned;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// All order details
const allOrders = asyncHandler(async (page) => {
  try {
    const limit = 9;
    const skip = (page - 1) * limit;
    const totalOrders = await Order.countDocuments();

    const orderData = await Order.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    const orderDetails = JSON.parse(JSON.stringify(orderData));
    const totalPages = Math.ceil(totalOrders / limit);

    return { orderDetails, totalPages };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// All Delivered order details
const allDeliveredOrders = asyncHandler(async () => {
  try {
    // const orderData = await Order.find({ orderStatus: 'delivered' });
    // const orderDetails = JSON.parse(JSON.stringify(orderData));

    const orderDetails = await Order.aggregate([
      {
        $match: { orderStatus: 'delivered' },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          orderId: '$_id',
          totalPrice: 1,
          grandTotalPrice: 1,
          createdAt: 1,
          paymentMethod: 1,
          // user: {
          // _id: '$user._id',
          firstname: '$user.firstname',
          lastname: '$user.lastname',
          email: '$user.email',
          mobile: '$user.mobile',
          // },
        },
      },
    ]);

    return { orderDetails };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Date wise all delivered orders
const dateWiseOrders = asyncHandler(async (data) => {
  try {
    const fromDate = new Date(data.fromDate);
    const toDate = new Date(data.toDate);
    toDate.setDate(toDate.getDate() + 1);
    console.log('data: ', data);
    const orderDetails = await Order.aggregate([
      {
        $match: {
          orderStatus: 'delivered',
          createdAt: {
            $gte: fromDate,
            $lt: toDate,
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          _id: 0,
          orderId: '$_id',
          totalPrice: 1,
          grandTotalPrice: 1,
          createdAt: 1,
          paymentMethod: 1,
          // user: {
          // _id: '$user._id',
          firstname: '$user.firstname',
          lastname: '$user.lastname',
          email: '$user.email',
          mobile: '$user.mobile',
          // },
        },
      },
    ]);

    return { orderDetails };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Update the order status
const updateOrderStatus = asyncHandler(async (orderId, orderStatus) => {
  try {
    const updated = await Order.updateOne(
      { orderId },
      { $set: { orderStatus } }
    );
    let paymentStatus;
    if (orderStatus === 'delivered') {
      paymentStatus = 'paid';
    } else if (orderStatus === 'returned') {
      paymentStatus = 'refunded';
    }
    const statusUpdated = await updatePaymentStatus(orderId, paymentStatus);
    if (updated && statusUpdated) return updated;
  } catch (error) {
    console.error(error);
    throw error;
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
    console.error(error);
    throw error;
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
    console.error(error);
    throw error;
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
    console.error(error);
    throw error;
  }
});

// Get wallet details
const getWalletDetails = asyncHandler(async (userId) => {
  try {
    const walletData = await Wallet.findOne({ userId }).sort({ createdAt: -1 });
    const walletDetails = JSON.parse(JSON.stringify(walletData));
    if (walletDetails) return walletDetails;
  } catch (error) {
    console.error(error);
    throw error;
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
  getWalletDetails,
  allDeliveredOrders,
  dateWiseOrders,
};
