const asyncHandler = require('express-async-handler');
const Product = require('../models/product-model');

// Find all products
const findProducts = async () => {
  const productDetails = await Product.find();
  // console.log(productDetails);
  if (productDetails) {
    // res.json(productDetails);
    return productDetails;
  }
  throw new Error();
};

module.exports = { findProducts };
