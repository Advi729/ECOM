const express = require('express');
// const {
//   createProduct,
//   getProduct,
//   getAllProducts,
//   updateProduct,
//   deleteProduct,
//   uploadImages,
// } = require('../controllers/product-controller');
const productControllers = require('../controllers/product-controller');

// const {
//   getAllUsers,
//   getaUser,
//   deleteaUser,
//   blockUser,
//   unblockUser,
//   handleRefreshToken,
//   logoutUser,
//   loginAdminGet,
//   loginAdminPost,
//   loginUserGet,
//   loginUserPost,
//   createUserGet,
//   createUserPost,
//   loginUserPostOTP,
//   loginUserGetOTP,
//   verifyOtp,
// } = require('../controllers/user-controller');
const userControllers = require('../controllers/user-controller');
const authMiddlewares = require('../middlewares/auth-middleware');
// const {
//   productImgResize,
//   uploadMultiplePhoto,
// } = require('../middlewares/uploadImages-middleware');
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
  // .post(createProduct);
  // .post(authMiddleware, isAdmin, createProduct);
  // .post( uploadMultiplePhoto, productImgResize, uploadImages, createProduct);
  // .post( uploadMultiplePhoto, uploadImages, createProduct);
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

router.delete('/:id', adminControllers.deleteaUser);
// put changed to get
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
router.get(
  '/:id',
  authMiddlewares.authMiddleware,
  authMiddlewares.isAdmin,
  productControllers.getProduct
);

// router.get('/products-list', getAllProducts);
router.put(
  '/:id',
  authMiddlewares.authMiddleware,
  authMiddlewares.isAdmin,
  productControllers.updateProduct
);
router.delete(
  '/:id',
  authMiddlewares.authMiddleware,
  authMiddlewares.isAdmin,
  productControllers.deleteProduct
);

// user manipulation in admin panel
router.get(
  '/:id',
  authMiddlewares.authMiddleware,
  authMiddlewares.isAdmin,
  userControllers.getaUser
);

module.exports = router;
