const asyncHandler = require('express-async-handler');
const couponHelpers = require('../helpers/coupon-helper');

// View all coupons
const viewAllCoupons = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const couponDetails = await couponHelpers.getAllCouponsAdmin();
    if (couponDetails) {
      res.render('admin/add-coupon', { admin, isAdmin: true, couponDetails });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Add coupon in admin side
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const created = await couponHelpers.addCoupon(req);
    if (created) {
      res.redirect('/admin/add-coupon');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Change status of coupon
const changeCouponStatus = asyncHandler(async (req, res) => {
  try {
    const { code } = req.params;
    const changed = await couponHelpers.changeStatus(code);
    if (changed) res.json({ status: true });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete coupon
const deleteCoupon = asyncHandler(async (req, res) => {
  try {
    const { code } = req.params;
    const deleted = await couponHelpers.deleteTheCoupon(code);
    if (deleted) res.redirect('/admin/add-coupon');
  } catch (error) {
    throw new Error(error);
  }
});

// Apply coupon to checkout
const applyCoupon = asyncHandler(async (req, res) => {
  try {
    const { couponCode, totalPrice } = req.body;
    console.log('apply:   ', req.body);

    const applied = await couponHelpers.applyDiscountPrice(
      couponCode,
      totalPrice
    );
    const { grandTotalPrice } = applied;
    console.log('grandTotal: ', grandTotalPrice);
    if (applied.status) {
      res.json({ status: true, grandTotalPrice, couponCode });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  viewAllCoupons,
  createCoupon,
  changeCouponStatus,
  deleteCoupon,
  applyCoupon,
};
