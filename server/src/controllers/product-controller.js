const asyncHandler = require('express-async-handler');
const productService = require('../services/product-service');

// POST /api/product
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    product,
  }); 
});

// GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts();
    
  res.status(200).json({
    success: true,
    count: products.length,
    products,
  });
});

// GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    res.status(404).json({
    success: false,
    message: 'Product not found',
    });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
};