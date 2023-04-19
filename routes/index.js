const express = require('express');
const userControllers = require('../controllers/user-controller');
const productControllers = require('../controllers/product-controller');
const cartControllers = require('../controllers/cart-controller');
const orderControllers = require('../controllers/order-controller');
const invoiceControllers = require('../controllers/invoice-controller');
const wishlistControllers = require('../controllers/wishlist-controller');
const userValidators = require('../validation/user-validation');
const authMiddlewares = require('../middlewares/auth-middleware');

const router = express.Router();

// User home page
router.get('/', userControllers.getHomePage);

// User sign up
router
  .route('/signup')
  .get(userControllers.createUserGet)
  // .post(getAllProductsUser, createUserPost);
  .post(userValidators.userSignUp, userControllers.createUserPost);

// User login
router
  .route('/login')
  .get(userControllers.loginUserGet)
  .post(userValidators.userLogin, userControllers.loginUserPost);

// User logout
router.get('/logout', userControllers.logoutUser);

// Login using OTP
router
  .route('/login-otp')
  .get(userControllers.loginUserGetOTP)
  .post(userValidators.userOtpLogin, userControllers.loginUserPostOTP);

// Verifying OTP
router
  .get('/verify-otp', userControllers.verifyOtpGet)
  .post('/verify-otp', userControllers.verifyOtpPost);

// View single product
router.get('/products/:slug', productControllers.getProduct);

// Shop menu
router.get('/shop', userControllers.getShop);

// Filter products by category
router.get('/categories/:categorySlug', userControllers.filterCategory);

// Filter products by sub-category
router.get(
  '/sub-categories/:subCategorySlug',
  userControllers.filterSubCategory
);

// Filter products by brand
router.get('/brands/:brandSlug', userControllers.filterBrand);

// User profile
router.get(
  '/profile/:_id',
  authMiddlewares.isUser,
  userControllers.getUserProfile
);

// Add address
router.post(
  '/add-address/:_id',
  authMiddlewares.isUser,
  userControllers.addAddress
);

// Edit Address
router.post(
  '/edit-address/:_id',
  authMiddlewares.isUser,
  userControllers.editAddress
);

// Delete Address
router.get(
  '/delete-address/:_id',
  authMiddlewares.isUser,
  userControllers.deleteAddress
);

// Edit profile

// Cart management
// Get cart details
router.get('/cart', authMiddlewares.isUser, cartControllers.getCart);

// Add to cart
router.get('/add-cart/:id', authMiddlewares.isUser, cartControllers.addToCart);

// Remove single product from cart
router.get(
  '/remove-cart/:id',
  authMiddlewares.isUser,
  cartControllers.removeProductFromCart
);

// Clear cart
router.get(
  '/clear-cart',
  authMiddlewares.isUser,
  cartControllers.clearCartProducts
);

// Change product quantity in cart
router.post(
  '/change-product-quantity',
  authMiddlewares.isUser,
  cartControllers.changeProductQuantity
);

// Proceed to Checkout
router.get('/check-out', authMiddlewares.isUser, orderControllers.checkOutCart);

// Place order
router.post(
  '/place-order',
  authMiddlewares.isUser,
  orderControllers.placeOrder
);

// Verify payment
router.post(
  '/verify-payment',
  authMiddlewares.isUser,
  orderControllers.verifyPayment
);

// View all orders
router.get('/orders', authMiddlewares.isUser, orderControllers.viewOrders);

// View single order
router.get(
  '/order-details',
  authMiddlewares.isUser,
  orderControllers.viewSingleOrder
);

// Cancel order
router.get(
  '/cancel-order/:id',
  authMiddlewares.isUser,
  orderControllers.cancelOrder
);

// Return order
router.get(
  '/return-order/:orderId',
  authMiddlewares.isUser,
  orderControllers.returnOrder
);

// Download invoice
router.get(
  '/invoice/:orderId',
  authMiddlewares.isUser,
  invoiceControllers.invoiceDownload
);

// Wish list
router.get(
  '/wishlist',
  authMiddlewares.isUser,
  wishlistControllers.getWishlist
);

router.get(
  '/add-to-wishlist/:id',
  authMiddlewares.isUser,
  wishlistControllers.addToWishlist
);

router.get(
  '/remove-wishlist/:id',
  authMiddlewares.isUser,
  wishlistControllers.removeFromWishlist
);

// pagination
// router.get('/products-pages', productControllers.pagination);

module.exports = router;
