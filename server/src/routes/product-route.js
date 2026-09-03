const express = require('express');
const { 
  createProduct, 
  getProducts, 
  getProductById, 
} = require('../controllers/product-controller');

const { protect, isAdmin } = require('../middlewares/auth-middleware');

const router = express.Router();


// Create product
router.post('/', protect, isAdmin, createProduct);

// Get all products
router.get('/', getProducts);

// Get single product
router.get('/:id', getProductById);

module.exports = router;