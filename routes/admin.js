const express = require('express');
const User = require('../models/user-model');
const {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  uploadImages,
} = require('../controllers/product-controller');

const {
  getAllUsers,
  getaUser,
  deleteaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  loginAdminGet,
  loginAdminPost,
  loginUserGet,
  loginUserPost,
  createUserGet,
  createUserPost,
  loginUserPostOTP,
  loginUserGetOTP,
  verifyOtp,
} = require('../controllers/user-controller');
const {
  authMiddleware,
  isAdmin,
  loggedInSession,
} = require('../middlewares/auth-middleware');
const {
  productImgResize,
  uploadMultiplePhoto,
} = require('../middlewares/uploadImages-middleware');

const router = express.Router();

router
  .route('/')
  .get(loggedInSession, loginAdminGet)
  .post(loggedInSession, loginAdminPost);

// logout not done

// admin dashboard
router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

// product management in admin side
router
  .route('/add-product')
  .get((req, res) => {
    res.render('admin/add-product', { admin: true });
  })
  // .post(createProduct);
  // .post(authMiddleware, isAdmin, createProduct);
  // .post( uploadMultiplePhoto, productImgResize, uploadImages, createProduct);
  // .post( uploadMultiplePhoto, uploadImages, createProduct);
  .post(uploadMultiplePhoto, createProduct);

// router.put('/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images',10), productImgResize, uploadImages);
// below is final
// router.put('/upload/:id', authMiddleware, isAdmin, uploadMultiplePhoto.array('images',10), productImgResize, uploadImages);

// router.post("/dashboard", authMiddleware, isAdmin, (req, res) => {
//     res.render("admin/dashboard");
// })  // confirm its usage then use it

// router.get('/products-list', authMiddleware, isAdmin , getAllProducts);
router.get('/products-list', getAllProducts);
router.get('/:id', authMiddleware, isAdmin, getProduct);
// router.get('/products-list', getAllProducts);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

// user manipulation in admin panel
router.get('/:id', authMiddleware, isAdmin, getaUser);
router.delete('/:id', deleteaUser);
router.put('/block-user/:id', authMiddleware, isAdmin, blockUser);
router.put('/unblock-user/:id', authMiddleware, isAdmin, unblockUser);

module.exports = router;
