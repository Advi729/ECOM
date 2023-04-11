const express = require('express');
const productControllers = require('../controllers/product-controller');
const authMiddlewares = require('../middlewares/auth-middleware');
const uploadMiddlewares = require('../middlewares/upload-images-middleware');
const adminControllers = require('../controllers/admin-controller');
const adminValidators = require('../validation/admin-validation');
const productValidators = require('../validation/product-validation');
const categoryValidators = require('../validation/category-validation');
const subCategoryValidators = require('../validation/sub-category-validation');
const brandValidators = require('../validation/brand-validation');
const categoryControllers = require('../controllers/category-controller');
const subCategoryControllers = require('../controllers/sub-category-controller');
const brandControllers = require('../controllers/brand-controller');

const router = express.Router();

// Admin home page
router.get('/', authMiddlewares.adminCheck, adminControllers.dashboardAdmin);

// Admin login
router
  .route('/login')
  .get(authMiddlewares.adminAuthentication, adminControllers.loginAdminGet)
  .post(adminValidators.adminLogin, adminControllers.loginAdminPost);

// Admin logout
router.get('/logout', adminControllers.adminLogOut);

// Admin dashboard
router.get(
  '/dashboard',
  authMiddlewares.adminCheck,
  adminControllers.dashboardAdmin
);

// Product management in admin side
// Add product
router
  .route('/add-product')
  .get(authMiddlewares.adminCheck, productControllers.createProductGet)
  // .post( uploadMultiplePhoto, productImgResize, uploadImages, createProduct);
  .post(
    uploadMiddlewares.uploadMultiplePhoto,
    productValidators.validateProduct,
    productValidators.validateAdd,
    productControllers.createProductPost
  );

// Products list
router.get(
  '/products-list',
  authMiddlewares.adminCheck,
  adminControllers.getAllProducts
);

// Single product
router.get(
  '/products/:slug',
  authMiddlewares.adminCheck,
  adminControllers.getProduct
);

// View users list
router.get(
  '/view-users',
  authMiddlewares.adminCheck,
  adminControllers.getAllUsers
);

// Block user (put changed to get)
router.get(
  '/block-user/:id',
  authMiddlewares.adminCheck,
  adminControllers.blockUser
);

// Unblock user
router.get(
  '/unblock-user/:id',
  authMiddlewares.adminCheck,
  adminControllers.unblockUser
);

// Edit product
router
  .route('/edit-product/:slug')
  .get(authMiddlewares.adminCheck, productControllers.editProductGet)
  .post(
    uploadMiddlewares.uploadMultiplePhoto,
    productValidators.validateProduct,
    productValidators.validateEdit,
    productControllers.editProductPost
  );

// Soft Delete product
router.get(
  '/delete-product/:slug',
  authMiddlewares.adminCheck,
  productControllers.deleteProduct
);

// Restore product
router.get(
  '/undelete-product/:slug',
  authMiddlewares.adminCheck,
  productControllers.unDeleteProduct
);

// Permanent delete Product
router.get(
  '/permanent-delete/:slug',
  authMiddlewares.adminCheck,
  productControllers.permanentDeleteProduct
);

//--------------------------------------------------------------------------------------------------------------------------------------
// Category management

// Display categories page and add category
router
  .route('/add-category')
  .get(authMiddlewares.adminCheck, categoryControllers.getAllCategories)
  .post(
    authMiddlewares.adminCheck,
    categoryValidators.validateCategory,
    categoryValidators.validateAdd,
    categoryControllers.createCategory
  );

// Edit category
router
  .route('/edit-category/:slug')
  .get(authMiddlewares.adminCheck, categoryControllers.getEditCategory)
  .post(
    authMiddlewares.adminCheck,
    categoryValidators.validateCategory,
    categoryValidators.validateEdit,
    categoryControllers.postEditCategory
  );

// Delete category
router
  .route('/delete-category/:slug')
  .get(authMiddlewares.adminCheck, categoryControllers.getDeleteCategory);

// Restore category
router
  .route('/restore-category/:slug')
  .get(authMiddlewares.adminCheck, categoryControllers.getRestoreCategory);

//--------------------------------------------------------------------------------------------------------------
// Sub-Category management

// Display sub-categories page and add category
router
  .route('/add-sub-category')
  .get(authMiddlewares.adminCheck, subCategoryControllers.getAllSubCategories)
  .post(
    authMiddlewares.adminCheck,
    subCategoryValidators.validateSubCategory,
    subCategoryValidators.validateAdd,
    subCategoryControllers.createSubCategory
  );

// Edit sub-category
router
  .route('/edit-sub-category/:slug')
  .get(authMiddlewares.adminCheck, subCategoryControllers.getEditSubCategory)
  .post(
    authMiddlewares.adminCheck,
    subCategoryValidators.validateSubCategory,
    subCategoryValidators.validateEdit,
    subCategoryControllers.postEditSubCategory
  );

// Delete sub-category
router
  .route('/delete-sub-category/:slug')
  .get(authMiddlewares.adminCheck, subCategoryControllers.getDeleteSubCategory);

// Restore sub-category
router
  .route('/restore-sub-category/:slug')
  .get(
    authMiddlewares.adminCheck,
    subCategoryControllers.getRestoreSubCategory
  );

//--------------------------------------------------------------------------------------------------------------------------------
// Brand management

// Display brands page and add brand
router
  .route('/add-brand')
  .get(authMiddlewares.adminCheck, brandControllers.getAllbrands)
  .post(
    authMiddlewares.adminCheck,
    brandValidators.validateBrand,
    brandValidators.validateAdd,
    brandControllers.createBrand
  );

// Edit brand
router
  .route('/edit-brand/:slug')
  .get(authMiddlewares.adminCheck, brandControllers.getEditBrand)
  .post(
    authMiddlewares.adminCheck,
    brandValidators.validateBrand,
    brandValidators.validateEdit,
    brandControllers.postEditBrand
  );

// Delete brand
router
  .route('/delete-brand/:slug')
  .get(authMiddlewares.adminCheck, brandControllers.getDeleteBrand);

// Restore brand
router
  .route('/restore-brand/:slug')
  .get(authMiddlewares.adminCheck, brandControllers.getRestoreBrand);

module.exports = router;
