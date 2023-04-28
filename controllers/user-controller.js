const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/user-model');
const twilioMiddlewares = require('../middlewares/twilio-middleware');
const productHelpers = require('../helpers/product-helper');
const userHelpers = require('../helpers/user-helper');
const categoryHelpers = require('../helpers/category-helper');
const subCategoryHelpers = require('../helpers/sub-category-helper');
const brandHelpers = require('../helpers/brand-helper');
const cartHelpers = require('../helpers/cart-helper');
const wishlistHelpers = require('../helpers/wishlist-helper');
const orderHelpers = require('../helpers/order-helper');
const couponHelpers = require('../helpers/coupon-helper');
const bannerHelpers = require('../helpers/banner-helper');

// Get home page
const getHomePage = asyncHandler(async (req, res) => {
  try {
    const { user } = req.session;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      const userId = user.response._id;
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    console.log('wishlistcout', wishlistCount);
    const foundProducts = await productHelpers.findAllProducts();
    const products = JSON.parse(JSON.stringify(foundProducts));

    const allBanners = await bannerHelpers.findAllBanners();

    res.render('user/home', {
      user,
      allProducts: products,
      isUser: true,
      cartCount,
      wishlistCount,
      allBanners,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// User sign up GET
const createUserGet = asyncHandler(async (req, res) => {
  res.render('user/signup', {
    signUpErr: req.session.signUpError,
    userExist: req.session.userExist,
    isUser: true,
  });
  req.session.userExist = false;
  req.session.signUpError = false;
});

// new User sign up post
const createUserPost = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    const err = errors.errors;
    // console.log('errorsignup:', err);
    if (!errors.isEmpty()) {
      req.session.signUpError = err[0].msg;
      res.redirect('/signup');
    } else {
      // console.log('req.body::::', req.body);
      const existingUser = await userHelpers.userSignUp(req.body);
      if (existingUser.status) {
        req.session.userExist = 'Username or phone already exist!!';
        res.redirect('/signup');
      } else {
        // console.log('existing:::', existingUser);
        req.session.user = existingUser;
        res.redirect('/');
        // res.redirect('/login');
        // const data = await productHelpers.findProducts();
        // // const { user } = req.session;
        // const products = JSON.parse(JSON.stringify(data));
        // res.render('user/home', { allProducts: products, isUser: true });
      }
    }
  } catch (error) {
    throw new Error();
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

// User login POST
const loginUserPost = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    // console.log(errors.errors);
    const err = errors.errors;
    if (!errors.isEmpty()) {
      req.session.loginError = err[0].msg;
      res.redirect('/login');
    } else {
      const loginStatus = await userHelpers.userLogin(req.body);
      // req.session.user = response;
      req.session.user = loginStatus;
      if (loginStatus.status) {
        res.redirect('/');
      } else if (loginStatus.blockedStatus) {
        req.session.statusError = 'You are blocked!';
        req.session.user = false;
        res.redirect('/login');
      } else {
        req.session.loginError = 'Invalid username or password!';
        req.session.user = false;
        res.redirect('/login');
      }
    }
  } catch (error) {
    throw new Error();
  }
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
    const errors = validationResult(req);
    const err = errors.errors;
    // console.log('error:',err);
    if (!errors.isEmpty()) {
      req.session.accountError = err[0].msg;
      res.redirect('/login-otp');
    } else {
      const { mobile } = req.body;
      //   const otp = generateOTP();
      const foundUser = await userHelpers.findOtp(mobile);
      req.session.user = foundUser;
      if (foundUser.response !== null) {
        twilioMiddlewares.send_otp(mobile).then((response) => {
          // const mobileNumber = req.body.mobileNumber;
          req.session.mobile = mobile;
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
    }
  } catch (error) {
    throw new Error();
  }
});

// User login otp verify get method
const verifyOtpGet = async (req, res) => {
  try {
    const { mobile } = req.session;
    res.render('user/otp', { mobile, otpError: req.session.otpError });
    req.session.otpErr = false;
  } catch (error) {
    throw new Error();
  }
};

// User login otp verify
const verifyOtpPost = async (req, res) => {
  try {
    const { mobile } = req.body;
    const { otp } = req.body;
    // Verify the OTP
    twilioMiddlewares.verifying_otp(mobile, otp).then((verification) => {
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

//------------------------------------------------------------------------------------------------------------------------------------------
// Render shop
const getShop = asyncHandler(async (req, res) => {
  try {
    const page = req.query.page || 1;
    const { foundProducts, totalPages } = await productHelpers.findProducts(
      page
    );
    const categories = await categoryHelpers.allCategories();
    const subCategories = await subCategoryHelpers.allSubCategories();
    const brands = await brandHelpers.allBrands();
    const { user } = req.session;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      const userId = user.response._id;
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    const products = JSON.parse(JSON.stringify(foundProducts));
    const pageShop = true;

    res.render('user/shop', {
      user,
      pageShop,
      allProducts: products,
      allCategories: categories,
      allSubCategories: subCategories,
      allBrands: brands,
      isUser: true,
      cartCount,
      wishlistCount,
      totalPages,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// filter products using category slug
const filterCategory = asyncHandler(async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const page = req.query.page || 1;

    const { user } = req.session;
    const categories = await categoryHelpers.allCategories();
    const subCategories = await subCategoryHelpers.allSubCategories();
    const brands = await brandHelpers.allBrands();
    const { foundProducts, totalPages } =
      await productHelpers.findProductsByCategorySlug(categorySlug, page);
    console.log('pages: ', totalPages);
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      const userId = user.response._id;
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }

    const categoryHeading = foundProducts[0].category;
    const pageCategory = true;
    if (foundProducts) {
      // res.render('user/shop-category', {
      res.render('user/shop', {
        user,
        pageCategory,
        isUser: true,
        categoryHeading,
        allProducts: foundProducts,
        allCategories: categories,
        allSubCategories: subCategories,
        allBrands: brands,
        cartCount,
        wishlistCount,
        totalPages,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// filter products using category slug
const filterSubCategory = asyncHandler(async (req, res) => {
  try {
    const { subCategorySlug } = req.params;
    // console.log('filterparamss:', req.params);
    const page = req.query.page || 1;

    const { user } = req.session;
    const categories = await categoryHelpers.allCategories();
    const subCategories = await subCategoryHelpers.allSubCategories();
    const brands = await brandHelpers.allBrands();
    const { foundProducts, totalPages } =
      await productHelpers.findProductsBySubCategorySlug(subCategorySlug, page);
    // console.log('fiiiiiiiiiiiiiiiiii', filteredCategory);
    const categoryHeading = foundProducts[0].category;
    const subHeading = foundProducts[0].subCategory;
    const { categorySlug } = foundProducts[0];
    const pageSubCategory = true;

    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      const userId = user.response._id;
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }

    if (foundProducts) {
      // res.render('user/shop-sub-category', {
      res.render('user/shop', {
        user,
        isUser: true,
        pageSubCategory,
        categoryHeading,
        subHeading,
        categorySlug,
        allProducts: foundProducts,
        allCategories: categories,
        allSubCategories: subCategories,
        allBrands: brands,
        cartCount,
        wishlistCount,
        totalPages,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// filter products using category slug
const filterBrand = asyncHandler(async (req, res) => {
  try {
    const { brandSlug } = req.params;
    // console.log('filterparamss:', req.params);
    const page = req.query.page || 1;

    const { user } = req.session;
    const categories = await categoryHelpers.allCategories();
    const subCategories = await subCategoryHelpers.allSubCategories();
    const brands = await brandHelpers.allBrands();
    const { foundProducts, totalPages } =
      await productHelpers.findProductsByBrandSlug(brandSlug, page);
    // console.log('fiiiiiiiiiiiiiiiiii', filteredCategory);
    const brandHeading = foundProducts[0].brand;
    const pageBrand = true;

    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      const userId = user.response._id;
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }

    if (foundProducts) {
      // res.render('user/shop-brand', {
      res.render('user/shop', {
        user,
        isUser: true,
        pageBrand,
        brandHeading,
        allProducts: foundProducts,
        allCategories: categories,
        allSubCategories: subCategories,
        allBrands: brands,
        cartCount,
        wishlistCount,
        totalPages,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const { user } = req.session;
    const userId = user.response._id;
    let cartCount = null;
    let wishlistCount = null;
    if (user) {
      cartCount = await cartHelpers.getCartCount(userId);
      wishlistCount = await wishlistHelpers.getWishlistCount(userId);
    }
    const resultUser = await userHelpers.findUser(_id);
    const finalUser = JSON.parse(JSON.stringify(resultUser));
    // console.log('user.res.address:',user.response.address);
    // console.log('fouhnduser::->profiel::', resultUser);
    const walletDetails = await orderHelpers.getWalletDetails(userId);
    const coupon = await couponHelpers.getAllCoupons(finalUser);
    console.log('coupons: ', coupon);
    if (resultUser) {
      res.render('user/profile', {
        isUser: true,
        user,
        foundUser: finalUser,
        cartCount,
        wishlistCount,
        walletDetails,
        coupon,
      });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Add address
const addAddress = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const addressAdded = await userHelpers.addUserAddress(_id, req);
    if (addressAdded) {
      res.redirect(`/profile/${_id}`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Add address Checkout
const addAddressCheckout = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const addressAdded = await userHelpers.addUserAddress(_id, req);
    if (addressAdded) {
      res.redirect(`/check-out`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Edit address
const editAddress = asyncHandler(async (req, res) => {
  try {
    // console.log('reached edit address>>>>>>>');
    const { _id } = req.params;
    const { user } = req.session;
    // console.log('userId:',user.response._id);
    const addressUpdated = await userHelpers.updateUserAddress(
      user.response._id,
      _id,
      req
    );
    if (addressUpdated) {
      res.redirect(`/profile/${user.response._id}`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Delete address
const deleteAddress = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const { user } = req.session;
    // console.log('userId:',user.response._id);
    const addressDeleted = await userHelpers.deleteUserAddress(
      user.response._id,
      _id
    );
    if (addressDeleted.acknowledged) {
      res.redirect(`/profile/${user.response._id}`);
    }
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
  getaUser,
  logoutUser,
  loginUserGetOTP,
  loginUserPostOTP,
  verifyOtpGet,
  verifyOtpPost,
  getShop,
  filterCategory,
  filterSubCategory,
  filterBrand,
  getUserProfile,
  addAddress,
  editAddress,
  deleteAddress,
  addAddressCheckout,
};
