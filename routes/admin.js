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
const orderControllers = require('../controllers/order-controller');
const couponControllers = require('../controllers/coupon-controller');
const offerControllers = require('../controllers/offer-controller');
const bannerControllers = require('../controllers/banner-controller');

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

// Dynamically display sub-categories
router.post('/get-sub-categories', categoryControllers.getSubCategories);

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

//----------------------------------------------------------------------------------------------------------------------------------------
// Order management

// view all orders
router.get(
  '/view-orders',
  authMiddlewares.adminCheck,
  orderControllers.allOrdersAdmin
);

// Order details
router.get(
  '/order-details/:orderId',
  authMiddlewares.adminCheck,
  orderControllers.orderDetails
);

// Change order status
router.post(
  '/order-status',
  authMiddlewares.adminCheck,
  orderControllers.changeOrderStatus
);

//------------------------------------------------------------------------------------------------------------
// Coupon management
// Display and create coupons
router
  .route('/add-coupon')
  .get(authMiddlewares.adminCheck, couponControllers.viewAllCoupons)
  .post(authMiddlewares.adminCheck, couponControllers.createCoupon);

// Change status of coupon
router.post(
  '/coupon-status/:code',
  authMiddlewares.adminCheck,
  couponControllers.changeCouponStatus
);

// Delete coupon
router.get(
  '/delete-coupon/:code',
  authMiddlewares.adminCheck,
  couponControllers.deleteCoupon
);

//----------------------------------------------------------------------------------------
// Offers
// Add offer for category
router
  .route('/add-category-offer')
  .get(authMiddlewares.adminCheck, offerControllers.getAddCategoryOffer)
  .post(authMiddlewares.adminCheck, offerControllers.postAddCategoryOffer);

// Change offer status
router.post(
  '/offer-status/:id',
  authMiddlewares.adminCheck,
  offerControllers.changeOfferStatus
);

// Delete offer
router.get(
  '/delete-offer/:id',
  authMiddlewares.adminCheck,
  offerControllers.deleteOffer
);

// Sales report
router
  .route('/sales-report')
  .get(authMiddlewares.adminCheck, adminControllers.getSalesReport);
// .post(authMiddlewares.adminCheck, adminControllers.downloadReport);

// Sort report datewise
router.post(
  '/sort-report',
  authMiddlewares.adminCheck,
  adminControllers.sortReportDateWise
);

//--------------------------------------------------------------------------------------------------
// Banner management
// Add banner
router
  .route('/add-banner')
  .get(authMiddlewares.adminCheck, bannerControllers.getAddBanner)
  .post(
    authMiddlewares.adminCheck,
    uploadMiddlewares.uploadSinglePhoto,
    bannerControllers.postAddBanner
  );

// Edit banner
router
  .route('/edit-banner/:id')
  .get(authMiddlewares.adminCheck, bannerControllers.getEditBanner)
  .post(
    authMiddlewares.adminCheck,
    uploadMiddlewares.uploadSinglePhoto,
    bannerControllers.postEditBanner
  );

// Delete banner
router.get(
  '/delete-banner/:id',
  authMiddlewares.adminCheck,
  bannerControllers.deleteBanner
);

module.exports = router;
