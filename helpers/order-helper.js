const asyncHandler = require('express-async-handler');
const Order = require('../models/order-model');
const Cart = require('../models/cart-model');

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

      const newOrder = new Order({
        orderId: generateOrderId(),
        userId: order.userId,
        deliveryDetails: address,
        paymentMethod: order.payment_option,
        products: productsList,
        orderStatus: status,
        totalPrice,
      });
      await newOrder.save();
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
const getOrderDetails = asyncHandler(async (userId) => {
  try {
    const orderDetails = await Order.find({ userId });
    //   console.log('carrrrrrrr',orderDetails);
    return orderDetails;
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
    const cancelled = await Order.updateOne(
      { orderId },
      { $set: { orderStatus: newStatus } }
    );
    if (cancelled) return cancelled;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createOrder,
  getOrderDetails,
  getSingleOrderDetails,
  cancelProductOrder,
};
