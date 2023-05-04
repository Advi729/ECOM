const asyncHandler = require('express-async-handler');
const Cart = require('../models/cart-model');

// Get cart Details
const getCartDetails = asyncHandler(async (userId) => {
  try {
    const cartDetails = await Cart.findOne({ userId });
    //   console.log('carrrrrrrr',cartDetails);
    return cartDetails;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Add product to cartSchema
const addProductToCart = asyncHandler(async (userId, prodId, subTotal) => {
  try {
    const prodObj = { prodId, quantity: 1, subTotal };
    const cartAdded = await Cart.findOne({ userId });
    if (!cartAdded) {
      // Create a new document with userId and the new product id
      const newCart = new Cart({
        userId,
        products: [prodObj],
        subTotal,
      });
      await newCart.save();
      return newCart;
    }
    // Update the existing document with the new product id
    const prodExist = cartAdded.products.findIndex(
      (product) => product.prodId == prodId
    );
    // console.log('prodExist:', prodExist);
    if (prodExist !== -1) {
      const updated = await Cart.updateOne(
        { userId, 'products.prodId': prodId },
        {
          $inc: { 'products.$.quantity': 1, 'products.$.subTotal': subTotal },
          // $set: { 'products.$.subTotal': subTotal },
        }
      );
      return updated;
    }
    const updated = await Cart.updateOne(
      { userId },
      { $push: { products: { $each: [prodObj], $position: 0 } } }
    );
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Remove product from cart model
const removeFromCart = asyncHandler(async (userId, prodId) => {
  try {
    const removed = await Cart.updateOne(
      { userId },
      { $pull: { products: { prodId } } }
    );
    return removed;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Clear products from the cart
const clearedCart = asyncHandler(async (userId) => {
  try {
    const cleared = await Cart.updateMany(
      { userId },
      { $set: { products: [] } }
    );
    return cleared;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Get cart count
const getCartCount = asyncHandler(async (userId) => {
  try {
    const cartDetails = await Cart.findOne({ userId });
    if (cartDetails) {
      const count = cartDetails.products.length;
      return count;
    }
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Change product quantity
const changeTheQuantity = asyncHandler(async (data, totalStock) => {
  try {
    const { userId, prodId, price, count } = data;

    console.log(
      'cartIdprosubTotalstockkkk:',
      userId,
      prodId,
      price,
      count,
      totalStock
    );

    const prodDetails = await Cart.findOne({
      userId,
      'products.prodId': prodId,
    });

    const product = prodDetails.products.find((p) => p.prodId == prodId);
    const totalQty = product.quantity;
    console.log('totalQty', totalQty);

    // const countProduct = parseInt(count, 10) + totalQty;
    const countProduct = parseInt(count, 10);
    console.log('count:', countProduct);
    // let finalSubTotal = parseFloat(price) * countProduct;
    const finalSubTotal = parseFloat(price) * countProduct;
    // finalSubTotal = parseFloat(finalSubTotal);
    console.log('finalssstotal', finalSubTotal);

    if (totalQty === 1 && countProduct === -1) {
      const deleted = await Cart.updateOne(
        { userId },
        {
          $pull: { products: { prodId } },
        }
      );
      if (deleted) return { removeProduct: true };
    } else if (
      totalQty < totalStock ||
      (totalQty === totalStock && countProduct === -1)
    ) {
      const updated = await Cart.updateOne(
        { userId, 'products.prodId': prodId },
        {
          $inc: {
            'products.$.quantity': countProduct,
            'products.$.subTotal': finalSubTotal,
          },
        }
      );
      if (updated) {
        return { updatedStatus: true, stockLimit: false };
      }
    } else if (totalQty === totalStock) {
      return { stockLimit: true };
    }
    return { stockLimit: false };
    // console.log('updated:', updated);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Delete the cart after order is placed
const deleteTheCart = asyncHandler(async (userId) => {
  try {
    const deleted = await Cart.deleteOne({ userId });
    return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = {
  getCartDetails,
  addProductToCart,
  removeFromCart,
  clearedCart,
  getCartCount,
  changeTheQuantity,
  deleteTheCart,
};
