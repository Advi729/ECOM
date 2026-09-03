const Product = require('../models/product-model');

// Add a product to db
const createProduct = async(data) => {
  const {
    title,
    description,
    price,
    discountPrice,
    category,
    subCategory,
    brand,
    stock,
    images,
    colors,
  } = data;

  return await Product.create({
    title,
    description,
    price,
    discountPrice,
    category,
    subCategory,
    brand,
    stock,
    images,
    colors,
  });
};

// Get all active products
const getProducts = async () => {
  return await Product.find({ isActive: true }).sort({
    createdAt: -1,
  });
};

// Get product by ID
const getProductById = async (productId) => {
  return await Product.findById(productId);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};
