const express = require('express');
const User = require('../models/user-model');
const {
  getAllProducts,
  getProduct,
  getAllProductsUser,
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
const userControllers = require('../controllers/user-controller');

const router = express.Router();

// router.get("/", (req,res)=>{
//     console.log("req.body");
//     res.render("user/user-index");
// router.get('/:id', getProduct);
// router.get('/', getAllProducts);
// });
// router.get('/', async (req, res) => {
//     let allProducts = getAllProducts();
//     res.render('index',{allProducts,user:true});
//     // // const allProducts = 100;
//     // console.log(req.body);
//     // if(req.body !== { }){
//     //     const { email } = req.body;
//     //     const adUser = await User.findOne({email});
//     //     if(adUser.role == "admin") {
//     //         res.render('admin/dashboard',{adUser,admin:true});
//     //     } else {
//     //         res.render('user/home',{adUser,allProducts,user:true});
//     //     }
//     // } else {
//     //     res.render('user/home',{allProducts,user:true});
//     // }

// });

// router.get('/:id', getProduct); // edit

// working code
// router.get('/', getAllProductsUser, (req, res) => {
//   const products = req.productsAll;
//   res.render('index', { allProducts: products });
// });

router.get('/', userControllers.getHomePage);

router
  .route('/signup')
  .get(userControllers.createUserGet)
  // .post(getAllProductsUser, createUserPost);
  .post(userControllers.createUserPost);

router
  .route('/login')
  // .get(loggedInSession, loginUserGet)
  .get(userControllers.loginUserGet)
  // .post(loggedInSession, getAllProductsUser, loginUserPost);
  .post(userControllers.loginUserPost);
// router.post("/login", loginUser);

router.get('/logout', userControllers.logoutUser);

router
  .route('/login-otp')
  .get(userControllers.loginUserGetOTP)
  .post(userControllers.loginUserPostOTP);

router
.get('/verify-otp', userControllers.verifyOtpGet)
.post('/verify-otp', userControllers.verifyOtpPost);

// router.get('/pr/:slug', getProduct, (req, res) => {
router.get('/:slug', getProduct, (req, res) => {
  const productDetails = req.oneProduct;
  console.log(productDetails);
  res.render('user/product-details', { product: productDetails });
});

router.get('/all-users', getAllUsers); // i think this should be in admin route
router.get('/refresh', handleRefreshToken);

module.exports = router;
