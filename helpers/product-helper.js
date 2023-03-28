const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/product-model');

// Find all products
const findProducts = async () => {
  try {
    const productDetails = await Product.find();
    const foundProducts = JSON.parse(JSON.stringify(productDetails));
    // console.log(productDetails);

    // res.json(productDetails);
    return foundProducts;
  } catch (error) {
    throw new Error();
  }
};

// Find a single product
const findSingleProduct = async (slug) => {
  try {
    const singleProduct = await Product.findOne({ slug });
    const foundProduct = JSON.parse(JSON.stringify(singleProduct));
    return foundProduct;
  } catch (error) {
    throw new Error();
  }
};

// Create a product
const createProduct = asyncHandler(async (data) => {
  try {
    const imagesFromReq = data.files.images;
    let imageFiles;
    const imageNames = [];
    imagesFromReq.forEach((element) => {
      [imageFiles] = [element];
      imageNames.push(imageFiles.filename);
    });

    const productTitle = data.body.title;
    let productSlug = slugify(productTitle, { lower: true, replacement: '_' });
    // check if slug is not already taken
    const checkSlug = await Product.findOne({ slug: productSlug });
    if (checkSlug) {
      productSlug += `-${Math.floor(Math.random() * 1000)}`;
    }

    const productData = { ...data.body, images: imageNames, slug: productSlug };
    const addedProduct = await Product.create(productData);
    return addedProduct;
  } catch (error) {
    throw new Error();
  }
});

module.exports = { findProducts, findSingleProduct, createProduct };
