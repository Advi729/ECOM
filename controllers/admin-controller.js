const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/user-model');
const Product = require('../models/product-model');
const productHelpers = require('../helpers/product-helper');
const adminHelpers = require('../helpers/admin-helper');

// Admin Dashboard
const dashboardAdmin = asyncHandler(async (req, res) => {
  const { admin } = req.session;
  res.render('admin/dashboard', { admin, isAdmin: true });
});

// Admin-login GET
const loginAdminGet = asyncHandler(async (req, res) => {
  res.render('admin/login', {
    isUser: true,
    emailError: req.session.emailError,
    passwordError: req.session.passwordError,
    validationError: req.session.validationError,
  });
  req.session.emailError = false;
  req.session.passwordError = false;
  req.session.validationError = false;
  // res.render('admin/login', { admin: true });
});

// Admin-login POST
const loginAdminPost = asyncHandler(async (req, res) => {
  try {
    const errors = validationResult(req);
    const err = errors.errors;
    console.log('err::-?',err);
    if (!errors.isEmpty()) {
      req.session.validationError = err[0].msg;
      res.redirect('/admin');
    } else {
      const adminStatus = await adminHelpers.adminLogin(req.body);
      if (adminStatus.status) {
        req.session.adminLoggedIn = true;
        req.session.admin = adminStatus.admin;
        res.redirect('/admin');
      } else if (adminStatus.notExist) {
        req.session.emailError = 'Username is invalid!';
        res.redirect('/admin');
      } else {
        req.session.passwordError = 'Password is invalid!';
        res.redirect('/admin');
      }
    }
  } catch (error) {
    throw new Error();
  }
});

// Admin LOG OUT
const adminLogOut = async (req, res) => {
  req.session.admin = false;
  res.redirect('/admin');
};

// new get all products admin side
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const foundProducts = await productHelpers.findProducts();
    if (foundProducts) {
      res.render('admin/view-products', {
        allProducts: foundProducts,
        isAdmin: true,
      });
    }
  } catch (error) {
    throw new Error();
  }
});

// Update a user

// Get details of all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await adminHelpers.findAllUsers();
    res.render('admin/view-users', { users, isAdmin: true });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const blockStatus = await adminHelpers.updateBlockStatus(id);
    console.log('blocvk:::', blockStatus);
    if (blockStatus.status) {
      // req.session.active = true;
      res.redirect('/admin/view-users');
    } else {
      // req.session.active = false;
      res.redirect('/admin/view-users');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const unBlockStatus = await adminHelpers.updateUnBlockStatus(id);
    if (unBlockStatus.status) {
      // req.session.active = true;
      res.redirect('/admin/view-users');
    } else {
      // req.session.active = false;
      res.redirect('/admin/view-users');
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  dashboardAdmin,
  loginAdminGet,
  loginAdminPost,
  adminLogOut,
  getAllProducts,
  deleteaUser,
  blockUser,
  unblockUser,
  getAllUsers,
};