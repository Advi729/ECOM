const express = require('express');
// const {
//   getAllProducts,
//   getProduct,
//   getAllProductsUser,
// } = require('../controllers/product-controller');
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
// const {
//   authMiddleware,
//   isAdmin,
//   loggedInSession,
// } = require('../middlewares/auth-middleware');
const userControllers = require('../controllers/user-controller');
const productControllers = require('../controllers/product-controller');
const userValidators = require('../validation/user-validation');

const router = express.Router();

router.get('/', userControllers.getHomePage);

router
  .route('/signup')
  .get(userControllers.createUserGet)
  // .post(getAllProductsUser, createUserPost);
  .post(userValidators.userSignUp, userControllers.createUserPost);

router
  .route('/login')
  .get(userControllers.loginUserGet)
  .post(userValidators.userLogin, userControllers.loginUserPost);

router.get('/logout', userControllers.logoutUser);

router
  .route('/login-otp')
  .get(userControllers.loginUserGetOTP)
  .post(userValidators.userOtpLogin, userControllers.loginUserPostOTP);

router
  .get('/verify-otp', userControllers.verifyOtpGet)
  .post('/verify-otp', userControllers.verifyOtpPost);

router.get('/product/:slug', productControllers.getProduct);

module.exports = router;
