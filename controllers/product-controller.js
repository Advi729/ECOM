const asyncHandler = require('express-async-handler');
// const { validationResult } = require('express-validator');
const productHelpers = require('../helpers/product-helper');
const categoryHelpers = require('../helpers/category-helper');
const subCategoryHelpers = require('../helpers/sub-category-helper');
const brandHelpers = require('../helpers/brand-helper');

// create product get
const createProductGet = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const findAllCategories = await categoryHelpers.allCategories();
    const findSubCategories = await subCategoryHelpers.allSubCategories();
    const findBrands = await brandHelpers.allBrands();
    res.render('admin/add-product', {
      admin,
      isAdmin: true,
      categories: findAllCategories,
      subCategories: findSubCategories,
      brands: findBrands,
      productSuccess: req.session.productSuccess,
      validationError: req.session.productValidationError,
    });
    req.session.productSuccess = false;
    req.session.productValidationError = false;
    req.session.imageValidationError = false;
  } catch (error) {
    throw new Error(error);
  }
});

// Create product post
const createProductPost = asyncHandler(async (req, res) => {
  try {
    const addedProduct = await productHelpers.createProduct(req);
    if (addedProduct) {
      req.session.productSuccess = 'Product created successfully.';
      req.session.productStatus = true;
      // res.redirect('/admin/products-list');
      res.redirect('/admin/add-product'); // to display message
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
    const { user } = req.session;
    // console.log('slu:  ', slug);
    const productDetails = await productHelpers.findSingleProduct(slug);
    // console.log(productDetails);
    if (productDetails) {
      res.render('user/product-details', {
        user,
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
    const { admin } = req.session;
    const productDetails = await productHelpers.findSingleProduct(slug);
    // console.log('productDetails:::->', productDetails);
    if (productDetails) {
      res.render('admin/edit-product', {
        admin,
        product: productDetails,
        isAdmin: true,
        editProductSuccess: req.session.editProductSuccess,
        editValidationError: req.session.editValidationError,
      });
      req.session.editProductSuccess = false;
      req.session.editValidationError = false;
      req.session.imageValidationError = false;
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
    // console.log('postSlug:', slug);
    // console.log('req.body:->', req.body);
    const edited = await productHelpers.updateProduct(slug, req);
    // console.log('editedProdut::->', edited);
    if (edited) {
      req.session.editProductSuccess = 'Product edited successfully.';
      req.session.editProductStatus = true;
      // res.redirect('/admin/products-list');
      res.redirect(`/admin/edit-product/${slug}`);
    } else {
      req.session.editProductSuccess = false;
      res.redirect(`/admin/edit-product/${slug}`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Unlist a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const deleteProd = await productHelpers.markDelete(slug);
    if (deleteProd) {
      req.session.unlistSuccess = `You have successfully unlisted  ${deleteProd.title}`;
      res.redirect('/admin/products-list');
    } else {
      res.redirect('/admin/products-list');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Restore a Unlisted product
const unDeleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const deleteProd = await productHelpers.unMarkDelete(slug);
    if (deleteProd) {
      req.session.restoreSuccess = `You have successfully restored  ${deleteProd.title}`;
      res.redirect('/admin/products-list');
    } else {
      res.redirect('/admin/products-list');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Permanent delete a product
const permanentDeleteProduct = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const deleteProd = await productHelpers.markPermanentDeleted(slug);
    if (deleteProd) {
      req.session.deleteSuccess = `You have permanently deleted  ${deleteProd.title}.`;
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
  permanentDeleteProduct,
};
