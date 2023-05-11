const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const User = require('../models/user-model');
const productHelpers = require('../helpers/product-helper');
const adminHelpers = require('../helpers/admin-helper');
const reportHelpers = require('../helpers/report-helper');
const orderHelpers = require('../helpers/order-helper');

// Admin Dashboard
const dashboardAdmin = asyncHandler(async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCategories,
      monthlySales,
    ] = await Promise.all([
      reportHelpers.computeTotalOrders(),
      reportHelpers.computeTotalRevenue(),
      reportHelpers.computeTotalProducts(),
      reportHelpers.computeTotalCategories(),
      reportHelpers.computeMonthlySales(),
    ]);
    const { totalSales } = monthlySales[0];

    console.log('totalrevenue: ', monthlySales[0]);

    // for chart
    const monthlyOrders = await reportHelpers.computeMonthlyOrders();
    const monthlyOds = JSON.stringify(monthlyOrders);
    console.log('monthlyorders: ', monthlyOrders);
    const monthlyOrdersArr = monthlyOrders.map((e) => e.count);
    console.log('monthlyordersARRR: ', monthlyOrdersArr);
    const categoryWiseCount =
      await reportHelpers.computeCategoryWiseDelivered();
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
      monthlyOrders: monthlyOds,
      categoryWiseCount: cat,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Admin-login GET
const loginAdminGet = asyncHandler(async (req, res, next) => {
  try {
    res.render('admin/login', {
      isUser: true,
      emailError: req.session.emailError,
      passwordError: req.session.passwordError,
      validationError: req.session.validationError,
      formData: req.session.formData,
    });
    req.session.emailError = false;
    req.session.passwordError = false;
    req.session.validationError = false;
    req.session.formData = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Admin-login POST
const loginAdminPost = asyncHandler(async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const err = errors.errors;
    // console.log('err::-?', err);
    if (!errors.isEmpty()) {
      req.session.validationError = err[0].msg;
      req.session.formData = req.body; // Store the user input in session
      res.redirect('/admin');
    } else {
      const adminStatus = await adminHelpers.adminLogin(req.body);
      if (adminStatus.status) {
        req.session.adminLoggedIn = true;
        req.session.admin = adminStatus.admin;
        res.redirect('/admin');
      } else if (adminStatus.notExist) {
        req.session.emailError = 'Username is invalid!';
        req.session.formData = req.body; // Store the user input in session
        req.session.admin = false;
        res.redirect('/admin');
      } else {
        req.session.passwordError = 'Password is invalid!';
        req.session.formData = req.body; // Store the user input in session
        req.session.admin = false;
        res.redirect('/admin');
      }
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Admin LOG OUT
const adminLogOut = (req, res) => {
  req.session.admin = false;
  res.redirect('/admin');
};

// Get all products admin side
const getAllProducts = asyncHandler(async (req, res, next) => {
  try {
    const page = req.query.page || 1;
    const { foundProducts, totalPages } =
      await productHelpers.findProductsForAdmin(page);
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
    console.error(error);
    next(error);
  }
});

// get a product admin side
const getProduct = asyncHandler(async (req, res, next) => {
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
    } else {
      const error = new Error('Product not Found');
      throw error;
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Update a user

// Get details of all users
const getAllUsers = asyncHandler(async (req, res, next) => {
  try {
    const { admin } = req.session;
    const users = await adminHelpers.findAllUsers();
    console.log('userss: ; ', users);
    if (users.length !== 0) {
      res.render('admin/view-users', {
        admin,
        users,
        isAdmin: true,
        blockedSuccess: req.session.blockedSuccess,
        unblockedSuccess: req.session.unblockedSuccess,
      });
      req.session.blockedSuccess = false;
      req.session.unblockedSuccess = false;
    }
    // } else {
    //   const error = new Error('An error occured while finding users');
    //   error.status = 404; // set the error status to 404 (Not Found)
    //   throw error;
    // }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Delete a user
const deleteaUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Block a user
const blockUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const blockStatus = await adminHelpers.updateBlockStatus(id);
    if (blockStatus.status) {
      req.session.blockedSuccess = `You have successfully blocked ${blockStatus.block.firstname} ${blockStatus.block.lastname}.`;
      res.redirect('/admin/view-users');
    } else {
      res.redirect('/admin/view-users');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res, next) => {
  try {
    const { id } = req.params;
    const unBlockStatus = await adminHelpers.updateUnBlockStatus(id);
    if (unBlockStatus.status) {
      req.session.blockedSuccess = `You have successfully unblocked ${unBlockStatus.unBlock.firstname} ${unBlockStatus.unBlock.lastname}.`;
      res.redirect('/admin/view-users');
    } else {
      // req.session.active = false;
      res.redirect('/admin/view-users');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Sales report
const getSalesReport = asyncHandler(async (req, res, next) => {
  try {
    const { admin } = req.session;
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      totalCategories,
      monthlySales,
      deliveredOrders,
    ] = await Promise.all([
      reportHelpers.computeTotalOrders(),
      reportHelpers.computeTotalRevenue(),
      reportHelpers.computeTotalProducts(),
      reportHelpers.computeTotalUsers(),
      reportHelpers.computeTotalCategories(),
      reportHelpers.computeMonthlySales(),
      orderHelpers.allDeliveredOrders(),
    ]);

    const { totalSales } = monthlySales[0];

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
    next(error);
  }
});

// Sort report date wise
const sortReportDateWise = asyncHandler(async (req, res, next) => {
  try {
    const { admin } = req.session;
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      totalCategories,
      monthlySales,
      deliveredOrders,
    ] = await Promise.all([
      reportHelpers.computeTotalOrders(),
      reportHelpers.computeTotalRevenue(),
      reportHelpers.computeTotalProducts(),
      reportHelpers.computeTotalUsers(),
      reportHelpers.computeTotalCategories(),
      reportHelpers.computeMonthlySales(),
      orderHelpers.dateWiseOrders(req.body),
    ]);

    const { totalSales } = monthlySales[0];

    // date wise delivered orders
    // const deliveredOrders = await orderHelpers.dateWiseOrders(req.body);

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
    next(error);
  }
});

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
