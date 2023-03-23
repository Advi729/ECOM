const asyncHandler = require('express-async-handler');
const twilio = require('twilio');
const User = require('../models/user-model');
const Product = require('../models/product-model');
const { generateToken } = require('../config/jwt-token');
const { generateRefreshToken } = require('../config/refresh-token');
const { getAllProducts } = require('./product-controller');
const twilioMiddlewares = require('../middlewares/twilio-middleware');
// const { allProducts } = require('../helpers/productHelpers');
const productHelpers = require('../helpers/product-helper');
const userHelpers = require('../helpers/user-helper');

// Get home page
const getHomePage = asyncHandler(async (req, res) => {
  const data = await productHelpers.findProducts();
  const { user } = req.session;
  const products = JSON.parse(JSON.stringify(data));
  // console.log(products);
  // res.render('user/view-products', { user, products, itsUser: true });
  // res.render('index', { allProducts: products });
  res.render('user/home', { user, allProducts: products, isUser: true });
});

// User sign up GET
const createUserGet = asyncHandler(async (req, res) => {
  res.render('user/signup', { userExist: req.session.userExist, isUser: true });
  req.session.userExist = false;
});

// User sign up POST
// const createUserPost = asyncHandler(async (req, res) => {
//   const { email } = req.body;
//   const findUser = await User.findOne({ email });
//   if (!findUser) {
//     // create new user
//     const newUser = await User.create(req.body);
//     // res.json(newUser);

//     const newusername = newUser.firstname;
//     // res.render('user/home',{newusername,user:true});
//     const products = req.productsAll;
//     // console.log(products);
//     res.render('user/home', {
//       newusername,
//       allProducts: products,
//       isUser: true,
//     });
//   } else {
//     // user already exists
//     // res.json({
//     //     msg: 'User Already Exists',
//     //     success: false
//     // })
//     res.redirect('/signup');
//     throw new Error('User already exists.');
//   }
// });

// new User sign up post
const createUserPost = asyncHandler(async (req, res) => {
  const existingUser = await userHelpers.userSignUp(req.body);
  if (existingUser.status) {
    req.session.userExist = 'Username or phone already exist!!';
    res.redirect('/signup');
  } else {
    // res.redirect('/login');
    const data = await productHelpers.findProducts();
    // const { user } = req.session;
    const products = JSON.parse(JSON.stringify(data));
    res.render('user/home', { allProducts: products, isUser: true });
  }
});

// User login GET
const loginUserGet = asyncHandler(async (req, res) => {
  res.render('user/login', {
    isUser: true,
    loginError: req.session.loginError,
    statusError: req.session.statusError,
  });
  req.session.loginError = false;
  req.session.statusError = false;
});

// User login GET using OTP
const loginUserGetOTP = asyncHandler(async (req, res) => {
  res.render('user/otp-form', {
    isUser: true,
    accountError: req.session.accountError,
    statusError: req.session.statusError,
  });
  req.session.accountError = false;
  req.session.statusError = false;
});

// User login POST using OTP
const loginUserPostOTP = asyncHandler(async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    //   const otp = generateOTP();
    const foundUser = await userHelpers.findOtp(mobileNumber);
    req.session.user = foundUser;
    if (foundUser.response !== null) {
      twilioMiddlewares.send_otp(mobileNumber).then((response) => {
        // const mobileNumber = req.body.mobileNumber;
        req.session.mobile = mobileNumber;
        res.redirect('/verify-otp');
        // res.render('user/otp', { title: 'OTP Verification', mobileNumber });
      });
    } else if (foundUser.response === null) {
      req.session.accountError = 'Number not registered with an account!';
      res.redirect('/login-otp');
    } else if (foundUser.response.blocked !== false) {
      req.session.statusError = 'Access has been denied!';
      res.redirect('login-otp');
    }
  } catch (error) {
    throw new Error();
  }
});

// User login otp verify get method
const verifyOtpGet = async (req, res) => {
  try {
    const mobileNumber = req.session.mobile;
    res.render('user/otp', { mobileNumber, otpError: req.session.otpError });
    req.session.otpErr = false;
  } catch (error) {
    throw new Error();
  }
};

// User login otp verify
const verifyOtpPost = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    const { otp } = req.body;
    // Verify the OTP
    twilioMiddlewares.verifying_otp(mobileNumber, otp).then((verification) => {
      if (verification.status === 'approved') {
        res.redirect('/');
      } else {
        req.session.otpErr = 'OTP is invalid!';
        res.redirect('/verify-otp');
      }
    // const products = req.productsAll;
    // res.render('user/home', { allProducts: products, user: true });
    // // here we need to send username
  });
  } catch (error) {
    throw new Error();
  }
};

// User login POST
// const loginUserPost = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   // console.log(email,password);
//   // user validation
//   const findUser = await User.findOne({ email });
//   if (findUser && (await findUser.isPasswordMatched(password))) {
//     // res.json(findUser);
//     const refreshToken = await generateRefreshToken(findUser?.id);
//     const updateUser = await User.findByIdAndUpdate(
//       findUser.id,
//       {
//         refreshToken,
//       },
//       { new: true }
//     );
//     res.cookie('refreshToken', refreshToken, {
//       httpOnly: true,
//       maxAge: 72 * 60 * 60 * 1000,
//     });
//     // res.json({
//     //     _id: findUser ?. _id,
//     //     firstname: findUser ?. firstname,
//     //     lastname: findUser ?. lastname,
//     //     email: findUser ?. email,
//     //     mobile: findUser ?. mobile,
//     //     token: generateToken(findUser ?. _id),
//     //     // role: findUser ?. role
//     // });
//     // const allProducts = getAllProducts();

//     // console.log(findUser.firstname);
//     // res.render('user/home',{findUser, user:true});
//     const username = findUser.firstname; // working

//     // let prods = productHelpers.allProducts();
//     // console.log('prods:',prods);

//     // res.render('user/home',{username, allProducts: prods, user:true});  // working

//     const products = req.productsAll;
//     // console.log(products);
//     res.render('user/home', { username, allProducts: products, user: true });
//   } else {
//     res.redirect('/login');
//     throw new Error('Invalid Credentials.');
//   }
// });

// new User login post
const loginUserPost = asyncHandler(async (req, res) => {
  const loginStatus = await userHelpers.userLogin(req.body);
  // req.session.user = response;
  req.session.user = loginStatus;
  if (loginStatus.status) {
    res.redirect('/');
  } else if (loginStatus.blockedStatus) {
    req.session.statusError = 'The user is blocked!';
    res.redirect('/login');
  } else {
    req.session.loginError = 'Invalid username or password!';
    res.redirect('/login');
  }
});

// logout user
// const logoutUser = asyncHandler(async (req, res) => {
//   const cookie = req.cookies;
//   // console.log(cookie);
//   if (!cookie?.refreshToken) throw new Error('No refresh token in cookie.');
//   const { refreshToken } = cookie;
//   const user = await User.findOne({ refreshToken });
//   if (!user) {
//     res.clearCookie('refreshToken', {
//       httpOnly: true,
//       secure: true,
//     });
//     res.sendStatus(204); // forbidden
//   }
//   await User.findOneAndUpdate(refreshToken, { refreshToken: ' ' });
//   res.clearCookie('refreshToken', {
//     httpOnly: true,
//     secure: true,
//   });
//   // res.redirect('/user/home');
//   res.redirect('/');
//   res.sendStatus(204);
// });

// new logout user
const logoutUser = asyncHandler(async (req, res) => {
  req.session.user = false;
  res.redirect('/');
});

// Get details of a user
const getaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log(req.params);
  try {
    const getUser = await User.findById(id);
    res.json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getHomePage,
  createUserGet,
  createUserPost,
  loginUserGet,
  loginUserPost,
  loginAdminGet,
  loginAdminPost,
  getAllUsers,
  getaUser,
  deleteaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logoutUser,
  loginUserGetOTP,
  loginUserPostOTP,
  verifyOtpGet,
  verifyOtpPost,
};
