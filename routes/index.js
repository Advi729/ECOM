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

router.get('/', getAllProductsUser, (req, res) => {
  const products = req.productsAll;
  res.render('index', { allProducts: products });
});

router
  .route('/signup')
  .get(createUserGet)
  .post(getAllProductsUser, createUserPost);
// router.post("/signup", createUser);

router
  .route('/login')
  .get(loggedInSession, loginUserGet)
  .post(loggedInSession, getAllProductsUser, loginUserPost);
// router.post("/login", loginUser);
router
  .route('/login-otp')
  .get(loggedInSession, loginUserGetOTP)
  .post(loggedInSession, loginUserPostOTP);

router.post('/verify', getAllProductsUser, verifyOtp);

// router.get('/pr/:slug', getProduct, (req, res) => {
router.get('/:slug', getProduct, (req, res) => {
  const productDetails = req.oneProduct;
  console.log(productDetails);
  res.render('user/product-details', { product: productDetails });
});

router.get('/all-users', getAllUsers); // i think this should be in admin route
router.get('/refresh', handleRefreshToken);
router.get('/logout', loggedInSession, logoutUser);

module.exports = router;
