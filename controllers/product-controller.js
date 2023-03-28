const asyncHandler = require('express-async-handler');
const Product = require('../models/product-model');
const productHelpers = require('../helpers/product-helper');

// create product get
const createProductGet = asyncHandler(async (req, res) => {
  res.render('admin/add-product', {
    isAdmin: true,
    productSuccess: req.session.productSuccess,
  });
  req.productSuccess = false;
});

// Create product post
const createProductPost = asyncHandler(async (req, res) => {
  try {
    const addedProduct = await productHelpers.createProduct(req);
    if (addedProduct) {
      req.session.productSuccess = 'Product created successfully.';
      req.session.productStatus = true;
      res.redirect('/admin/products-list');
      // res.redirect('/admin/add-product'); // to display message
    } else {
      req.session.productSuccess = false;
      res.redirect('/admin/add-product');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Get a product
const getProduct = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    // console.log('slu:  ', slug);
    const productDetails = await productHelpers.findSingleProduct(slug);
    // console.log(productDetails);
    if (productDetails) {
      res.render('user/product-details', {
        product: productDetails,
        isUser: true,
      });
    }
  } catch (error) {
    throw new Error();
  }
});

// Update a product GET
const editProductGet = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    const productDetails = await productHelpers.findSingleProduct(slug);
    // console.log('productDetails:::->', productDetails);
    if (productDetails) {
      res.render('admin/edit-product', {
        product: productDetails,
        isAdmin: true,
        editProductSuccess: req.session.editProductSuccess,
      });
      req.session.editProductSuccess = false;
    } else {
      res.redirect('/admin/products-list');
    }
  } catch (error) {
    throw new Error();
  }
});

// Update a product POST
const editProductPost = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    console.log('postSlug:', slug);
    console.log('req.body:->', req.body);
    const edited = await productHelpers.updateProduct(slug, req);
    console.log('editedProdut::->', edited);
    if (edited) {
      req.session.editProductSuccess = 'Product edited successfully.';
      req.session.editProductStatus = true;
      res.redirect('/admin/products-list');
    } else {
      req.session.editProductSuccess = false;
      res.redirect('/admin/edit-product');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const deleteProd = await productHelpers.markDelete(slug);
    if (deleteProd) {
      res.redirect('/admin/products-list');
    } else {
      res.redirect('/admin/products-list');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Restore a deleted product
const unDeleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const deleteProd = await productHelpers.restoreProduct(slug);
    if (deleteProd) {
      res.redirect('/admin/products-list');
    } else {
      res.redirect('/admin/products-list');
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProductGet,
  createProductPost,
  getProduct,
  editProductGet,
  editProductPost,
  deleteProduct,
  unDeleteProduct,
};
