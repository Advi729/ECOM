const express = require('express');
const productControllers = require('../controllers/product-controller');
const userControllers = require('../controllers/user-controller');
const authMiddlewares = require('../middlewares/auth-middleware');
const uploadMiddlewares = require('../middlewares/uploadImages-middleware');
const adminControllers = require('../controllers/admin-controller');
const adminValidators = require('../validation/admin-validation');

const router = express.Router();

// admin home page
router.get('/', authMiddlewares.adminCheck, adminControllers.dashboardAdmin);
// router.get('/', adminControllers.dashboardAdmin);
// router.get('/', async (req, res) => {
//   res.render('admin/login');
// });

router
  .route('/login')
  .get(authMiddlewares.adminAuthentication, adminControllers.loginAdminGet)
  .post(adminValidators.adminLogin, adminControllers.loginAdminPost);

// admin logout
router.get('/logout', adminControllers.adminLogOut);

// admin dashboard
router.get(
  '/dashboard',
  authMiddlewares.adminCheck,
  adminControllers.dashboardAdmin
);

// product management in admin side
router
  .route('/add-product')
  .get(authMiddlewares.adminCheck, productControllers.createProductGet)
  // .post( uploadMultiplePhoto, productImgResize, uploadImages, createProduct);
  .post(
    uploadMiddlewares.uploadMultiplePhoto,
    productControllers.createProductPost
  );

// router.get('/products-list', authMiddleware, isAdmin , getAllProducts);
router.get(
  '/products-list',
  authMiddlewares.adminCheck,
  adminControllers.getAllProducts
);

// view user list
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
router.get(
  '/unblock-user/:id',
  authMiddlewares.adminCheck,
  adminControllers.unblockUser
);

// old apis

// Edit product
router
  .route('/edit-product/:slug')
  .get(authMiddlewares.adminCheck, productControllers.editProductGet)
  .post(authMiddlewares.adminCheck, productControllers.editProductPost);

// Soft Delete product
router.get(
  '/delete-product/:slug',
  authMiddlewares.adminCheck,
  productControllers.deleteProduct
);

router.get(
  '/undelete-product/:slug',
  authMiddlewares.adminCheck,
  productControllers.unDeleteProduct
);

// user manipulation in admin panel
// router.get(
//   '/:id',
//   authMiddlewares.authMiddleware,
//   authMiddlewares.isAdmin,
//   userControllers.getaUser
// );

module.exports = router;
