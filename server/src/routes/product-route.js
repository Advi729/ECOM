const express = require('express');
const productController = require('../controllers/product-controller');

const router = express.Router();

// Create product
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getProducts);

// Get single product
router.get('/:id', productController.getProductById);

module.exports = router;