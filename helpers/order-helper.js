const asyncHandler = require('express-async-handler');
const Order = require('../models/order-model');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const productHelpers = require('./product-helper');

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

// All order details
const allOrders = asyncHandler(async () => {
  try {
    const orderData = await Order.find();
    const orderDetails = JSON.parse(JSON.stringify(orderData));
    return orderDetails;
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

module.exports = {
  createOrder,
  getOrderDetails,
  getSingleOrderDetails,
  cancelProductOrder,
  allOrders,
  updateOrderStatus,
};
