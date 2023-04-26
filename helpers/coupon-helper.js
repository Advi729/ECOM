const asyncHandler = require('express-async-handler');
const shortid = require('shortid');
const Coupon = require('../models/coupon-model');

// Get all coupons admin side
const getAllCouponsAdmin = asyncHandler(async () => {
  try {
    const findCoupons = await Coupon.find().sort({ createdAt: -1 });
    const foundCoupons = JSON.parse(JSON.stringify(findCoupons));
    if (foundCoupons) return foundCoupons;
  } catch (error) {
    throw new Error(error);
  }
});

// Get all coupons user side
const getAllCoupons = asyncHandler(async (userdetails) => {
  try {
    const findCoupons = await Coupon.find().sort({ createdAt: -1 });
    const foundCoupons = JSON.parse(JSON.stringify(findCoupons));
    // filter used up coupons for user
    const filteredCouponDetails = foundCoupons.reduce((acc, coupon) => {
      const matchingCoupons = userdetails.coupons.filter(
        (c) => c.code === coupon.code
      );

      const matchingCouponDetails = matchingCoupons.map((c) => ({
        code: c.code,
        timesUsed: c.timesUsed,
      }));
      if (matchingCouponDetails.length > 0) {
        // coupon is in userdetails array
        if (coupon.maximumUse > matchingCouponDetails[0].timesUsed) {
          acc.push(matchingCouponDetails[0]);
        }
      } else {
        // coupon is not in userdetails array
        acc.push(coupon);
      }
      return acc;
    }, []);

    // if (foundCoupons) return foundCoupons;
    if (filteredCouponDetails) return filteredCouponDetails;
  } catch (error) {
    throw new Error(error);
  }
});

// Get details of single coupon
const getSingleCoupon = asyncHandler(async (code) => {
  try {
    const findCoupon = await Coupon.findOne({ code });
    const foundCoupon = JSON.parse(JSON.stringify(findCoupon));
    if (foundCoupon) return foundCoupon;
  } catch (error) {
    throw new Error(error);
  }
});

// Add coupon
const addCoupon = asyncHandler(async (data) => {
  try {
    const code = shortid.generate();
    const coupon = {
      ...data.body,
      code,
    };
    const newCoupon = await Coupon.create(coupon);
    if (newCoupon) return newCoupon;
  } catch (error) {
    throw new Error(error);
  }
});

// Change status
const changeStatus = asyncHandler(async (code) => {
  try {
    const coupon = await Coupon.findOne({ code });

    // Toggle the active field
    coupon.active = !coupon.active;

    // Save the updated coupon to the database
    const changed = await coupon.save();

    return changed;
  } catch (error) {
    throw new Error(error);
  }
});

// Delete the coupon
const deleteTheCoupon = asyncHandler(async (code) => {
  try {
    const deleted = await Coupon.deleteOne({ code });
    if (deleted) return deleted;
  } catch (error) {
    throw new Error(error);
  }
});

// Apply the coupon
const applyDiscountPrice = asyncHandler(async (code, totalPrice) => {
  try {
    const coupon = await Coupon.findOne({ code });
    if (coupon.minimumPurchase <= totalPrice) {
      const discountPrice = (totalPrice * coupon.discountPercentage) / 100;
      const grandTotalPrice = totalPrice - discountPrice;
      return { grandTotalPrice, status: true };
    }
    return { status: false };
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addCoupon,
  getAllCoupons,
  getAllCouponsAdmin,
  changeStatus,
  deleteTheCoupon,
  getSingleCoupon,
  applyDiscountPrice,
};
