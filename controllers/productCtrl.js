const Product = require('../models/productModel');
const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');
  

// Create product 
const createProduct = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Product.create(req.body); 
        res.json(newProduct);
        // here we have to give successfully added message
    } catch (error) { 
        throw new Error(error);
    }
});

// Get a product
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})

//Get all products 
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const findAllProducts = await Product.find();
        // res.json({findAllProducts});
        // res.render('index',{findAllProducts});
        res.render('admin/view-products',{findAllProducts, admin:true});
    } catch (error) {
        throw new Error(error); 
    }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateProd = await Product.findOneAndUpdate(
            id,
            req.body,
            {new:true}
        );
        res.json(updateProd);
    } catch (error) {
        throw new Error(error); 
    }
});   

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const deleteProd = await Product.findByIdAndDelete(id);
        res.json(deleteProd);
    } catch (error) {
        throw new Error(error); 
    }
}); 
    

module.exports = { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct };