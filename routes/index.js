const express = require('express');
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

router.get('/products/:slug', productControllers.getProduct);

router.get('/shop', userControllers.getShop);

router.get('/categories/:categorySlug', userControllers.filterCategory);

router.get(
  '/sub-categories/:subCategorySlug',
  userControllers.filterSubCategory
);

module.exports = router;
