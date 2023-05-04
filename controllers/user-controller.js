const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
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
const getHomePage = asyncHandler(async (req, res, next) => {
  try {
    const { user } = req.session;
    console.log('user:', user);
    console.log('req.session:', req.session);
    let cartCount = null;
    let wishlistCount = null;
    if (user?.response) {
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
    console.error(error);
    next(error);
  }
});

// User sign up GET
const createUserGet = asyncHandler(async (req, res, next) => {
  try {
    res.render('user/signup', {
      signUpErr: req.session.signUpError,
      userExist: req.session.userExist,
      formData: req.session.formData,
      isUser: true,
    });
    req.session.userExist = false;
    req.session.signUpError = false;
    req.session.formData = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// User sign up post
const createUserPost = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const err = errors.errors;
    // console.log('errorsignup:', err);
    if (!errors.isEmpty()) {
      req.session.signUpError = err[0].msg;
      req.session.formData = req.body; // Store the user input in session
      res.redirect('/signup');
    } else {
      // console.log('req.body::::', req.body);
      const existingUser = await userHelpers.userSignUp(req.body);
      if (existingUser.status) {
        req.session.userExist = 'Username or phone already exist!!';
        req.session.formData = req.body; // Store the user input in session
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
    console.error(error);
    next(error);
  }
});

// User login GET
const loginUserGet = asyncHandler(async (req, res, next) => {
  try {
    res.render('user/login', {
      isUser: true,
      loginError: req.session.loginError,
      statusError: req.session.statusError,
      formData: req.session.formData,
    });
    req.session.loginError = false;
    req.session.statusError = false;
    req.session.formData = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// User login POST
const loginUserPost = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    // console.log(errors.errors);
    const err = errors.errors;
    if (!errors.isEmpty()) {
      req.session.loginError = err[0].msg;
      req.session.formData = req.body;
      res.redirect('/login');
    } else {
      const loginStatus = await userHelpers.userLogin(req.body);
      // req.session.user = response;
      req.session.user = loginStatus;
      if (loginStatus.status) {
        res.redirect('/');
      } else if (loginStatus.blockedStatus) {
        req.session.statusError = 'You are blocked!';
        req.session.formData = req.body;
        req.session.user = false;
        res.redirect('/login');
      } else {
        req.session.loginError = 'Invalid username or password!';
        req.session.formData = req.body;
        req.session.user = false;
        res.redirect('/login');
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// User login GET using OTP
const loginUserGetOTP = asyncHandler(async (req, res, next) => {
  try {
    res.render('user/otp-form', {
      isUser: true,
      accountError: req.session.accountError,
      statusError: req.session.statusError,
      formData: req.session.formData,
    });
    req.session.accountError = false;
    req.session.statusError = false;
    req.session.formData = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// User login POST using OTP
const loginUserPostOTP = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const err = errors.errors;
    // console.log('error:',err);
    if (!errors.isEmpty()) {
      req.session.accountError = err[0].msg;
      req.session.formData = req.body;
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
        req.session.formData = req.body;
        res.redirect('/login-otp');
      } else if (foundUser.response.blocked !== false) {
        req.session.statusError = 'Access has been denied!';
        req.session.formData = req.body;
        res.redirect('login-otp');
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// User login otp verify get method
const verifyOtpGet = async (req, res, next) => {
  try {
    const { mobile } = req.session;
    console.log('mobile in verifyOtpGet: ', mobile);
    res.render('user/otp', { mobile, otpError: req.session.otpErr });
    req.session.otpErr = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// User login otp verify
const verifyOtpPost = asyncHandler(async (req, res, next) => {
  try {
    const { mobile } = req.body;
    const { otp } = req.body;
    console.log('body in verifyotpost: ', req.body);
    console.log('mobileNo in controller: ', mobile);

    // Verify the OTP
    twilioMiddlewares.verifying_otp(mobile, otp).then((verification) => {
      if (verification.status === 'approved') {
        res.redirect('/');
      } else {
        req.session.otpErr = 'OTP is invalid!';
        res.redirect('/verify-otp');
      }
    });
  } catch (error) {
    // if (error instanceof client.constructor.RestClient.RestException) {
    //   console.error(error.code);
    //   console.error(error.message);
    //   console.error(error.moreInfo);
    //   req.session.otpErr =
    //     'An error occurred while verifying your OTP. Please check your mobile number and OTP and try again.';
    //   res.redirect('/verify-otp');
    // } else {
    //   console.error(error);
    // }
    console.error(error);
    next(error);
  }
});

// new logout user
const logoutUser = asyncHandler(async (req, res) => {
  req.session.user = false;
  res.redirect('/');
});

// Get details of a user
const getaUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const getUser = await User.findById(id);
    res.json({ getUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//------------------------------------------------------------------------------------------------------------------------------------------
// Render shop
const getShop = asyncHandler(async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const { foundProducts, totalPages } = await productHelpers.findProducts(
      page
    );
    const productsForSlugs = await productHelpers.findAllProducts();
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

    // all slugs from products
    const { allCategorySlugs, allSubCategorySlugs, allBrandSlugs } =
      await userHelpers.allSlugsInProducts(productsForSlugs);

    console.log(
      'found categories   : ',
      allCategorySlugs,
      allSubCategorySlugs,
      allBrandSlugs
    );

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
      allCategorySlugs,
      allSubCategorySlugs,
      allBrandSlugs,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// filter products using category slug
const filterCategory = asyncHandler(async (req, res, next) => {
  try {
    const { categorySlug } = req.params;
    const page = req.query.page || 1;

    const { user } = req.session;
    const productsForSlugs = await productHelpers.findAllProducts();
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

    // all slugs from products
    const { allCategorySlugs, allSubCategorySlugs, allBrandSlugs } =
      await userHelpers.allSlugsInProducts(productsForSlugs);

    if (foundProducts) {
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
        allCategorySlugs,
        allSubCategorySlugs,
        allBrandSlugs,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// filter products using category slug
const filterSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const { subCategorySlug } = req.params;
    // console.log('filterparamss:', req.params);
    const page = req.query.page || 1;

    const { user } = req.session;
    const productsForSlugs = await productHelpers.findAllProducts();
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

    // all slugs from products
    const { allCategorySlugs, allSubCategorySlugs, allBrandSlugs } =
      await userHelpers.allSlugsInProducts(productsForSlugs);

    if (foundProducts) {
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
        allCategorySlugs,
        allSubCategorySlugs,
        allBrandSlugs,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// filter products using category slug
const filterBrand = asyncHandler(async (req, res, next) => {
  try {
    const { brandSlug } = req.params;
    // console.log('filterparamss:', req.params);
    const page = req.query.page || 1;

    const { user } = req.session;
    const productsForSlugs = await productHelpers.findAllProducts();
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

    // all slugs from products
    const { allCategorySlugs, allSubCategorySlugs, allBrandSlugs } =
      await userHelpers.allSlugsInProducts(productsForSlugs);

    if (foundProducts) {
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
        allCategorySlugs,
        allSubCategorySlugs,
        allBrandSlugs,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// get user profile
const getUserProfile = asyncHandler(async (req, res, next) => {
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
    } else {
      const error = new Error('User not found');
      error.status = 404; // set the error status to 404 (Not Found)
      throw error;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Add address
const addAddress = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.params;
    const addressAdded = await userHelpers.addUserAddress(_id, req);
    if (addressAdded) {
      res.redirect(`/profile/${_id}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Add address Checkout
const addAddressCheckout = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.params;
    const addressAdded = await userHelpers.addUserAddress(_id, req);
    if (addressAdded) {
      res.redirect(`/check-out`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Edit address
const editAddress = asyncHandler(async (req, res, next) => {
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
    console.error(error);
    next(error);
  }
});

// Delete address
const deleteAddress = asyncHandler(async (req, res, next) => {
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
    console.error(error);
    next(error);
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
