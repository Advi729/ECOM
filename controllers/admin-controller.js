const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/user-model');
const productHelpers = require('../helpers/product-helper');
const adminHelpers = require('../helpers/admin-helper');
const reportHelpers = require('../helpers/report-helper');
const orderHelpers = require('../helpers/order-helper');

// Admin Dashboard
const dashboardAdmin = asyncHandler(async (req, res) => {
  const totalOrders = await reportHelpers.computeTotalOrders();
  const totalRevenue = await reportHelpers.computeTotalRevenue();
  const totalProducts = await reportHelpers.computeTotalProducts();
  const totalCategories = await reportHelpers.computeTotalCategories();
  const monthlySales = await reportHelpers.computeMonthlySales();

  const { totalSales } = monthlySales[0];

  console.log('totalrevenue: ', monthlySales[0]);

  // for chart
  const monthlyOrders = await reportHelpers.computeMonthlyOrders();
  console.log('monthlyorders: ', monthlyOrders);
  const monthlyOrdersArr = monthlyOrders.map((e) => e.count);
  console.log('monthlyordersARRR: ', monthlyOrdersArr);
  const categoryWiseCount = await reportHelpers.computeCategoryWiseDelivered();
  console.log('categoryWiseCount: ', categoryWiseCount);
  // const categoryWiseCountValues = Object.values(categoryWiseCount);
  const cat = JSON.stringify(categoryWiseCount);

  const { admin } = req.session;
  res.render('admin/dashboard', {
    admin,
    isAdmin: true,
    totalOrders,
    totalRevenue,
    totalProducts,
    totalCategories,
    totalSales,
    monthlyOrdersArr,
    categoryWiseCount: cat,
  });
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
    // console.log('err::-?', err);
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
        req.session.admin = false;
        res.redirect('/admin');
      } else {
        req.session.passwordError = 'Password is invalid!';
        req.session.admin = false;
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
    const page = req.query.page || 1;
    const { foundProducts, totalPages } = await productHelpers.findProducts(
      page
    );
    const { admin } = req.session;
    if (foundProducts) {
      res.render('admin/view-products', {
        admin,
        allProducts: foundProducts,
        isAdmin: true,
        unlistSuccess: req.session.unlistSuccess,
        restoreSuccess: req.session.restoreSuccess,
        deleteSuccess: req.session.deleteSuccess,
        totalPages,
      });
      req.session.unlistSuccess = false;
      req.session.restoreSuccess = false;
      req.session.deleteSuccess = false;
    }
  } catch (error) {
    throw new Error();
  }
});

// get a product admin side
const getProduct = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    const { admin } = req.session;
    // console.log('slu:  ', slug);
    const productDetails = await productHelpers.findSingleProduct(slug);
    // console.log(productDetails);
    if (productDetails) {
      res.render('admin/product-details', {
        admin,
        product: productDetails,
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
    const { admin } = req.session;
    res.render('admin/view-users', {
      admin,
      users,
      isAdmin: true,
      blockedSuccess: req.session.blockedSuccess,
      unblockedSuccess: req.session.unblockedSuccess,
    });
    req.session.blockedSuccess = false;
    req.session.unblockedSuccess = false;
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log(req.params);
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
    // console.log('blocvk:::', blockStatus);
    if (blockStatus.status) {
      req.session.blockedSuccess = `You have successfully blocked ${blockStatus.block.firstname} ${blockStatus.block.lastname}.`;
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
      req.session.blockedSuccess = `You have successfully unblocked ${unBlockStatus.unBlock.firstname} ${unBlockStatus.unBlock.lastname}.`;
      res.redirect('/admin/view-users');
    } else {
      // req.session.active = false;
      res.redirect('/admin/view-users');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Sales report
const getSalesReport = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const totalOrders = await reportHelpers.computeTotalOrders();
    const totalRevenue = await reportHelpers.computeTotalRevenue();
    const totalProducts = await reportHelpers.computeTotalProducts();
    const totalUsers = await reportHelpers.computeTotalUsers();
    const totalCategories = await reportHelpers.computeTotalCategories();
    const monthlySales = await reportHelpers.computeMonthlySales();

    const { totalSales } = monthlySales[0];

    const deliveredOrders = await orderHelpers.allDeliveredOrders();

    res.render('admin/sales-report', {
      admin,
      isAdmin: true,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      totalCategories,
      totalSales,
      deliveredOrders,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// Sort report date wise
const sortReportDateWise = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const totalOrders = await reportHelpers.computeTotalOrders();
    const totalRevenue = await reportHelpers.computeTotalRevenue();
    const totalProducts = await reportHelpers.computeTotalProducts();
    const totalUsers = await reportHelpers.computeTotalUsers();
    const totalCategories = await reportHelpers.computeTotalCategories();
    const monthlySales = await reportHelpers.computeMonthlySales();

    const { totalSales } = monthlySales[0];

    // date wise delivered orders
    const deliveredOrders = await orderHelpers.dateWiseOrders(req.body);

    res.render('admin/sales-report', {
      admin,
      isAdmin: true,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      totalCategories,
      totalSales,
      deliveredOrders,
    });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// Download report
// const downloadReport = asyncHandler(async (req, res) => {
//   try {
//     const a = 1;
//   } catch (error) {
//     console.error(error);
//     throw new Error(error);
//   }
// });

module.exports = {
  dashboardAdmin,
  loginAdminGet,
  loginAdminPost,
  adminLogOut,
  getAllProducts,
  getProduct,
  deleteaUser,
  blockUser,
  unblockUser,
  getAllUsers,
  getSalesReport,
  sortReportDateWise,
};
