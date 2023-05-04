const asyncHandler = require('express-async-handler');
const Order = require('../models/order-model');
const Product = require('../models/product-model');
const Category = require('../models/category-model');
const User = require('../models/user-model');

// compute total orders
const computeTotalOrders = asyncHandler(async () => {
  try {
    const totalOrders = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      { $count: 'totalOrders' },
    ]);
    return totalOrders[0].totalOrders;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// compute total revenue
const computeTotalRevenue = asyncHandler(async () => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: 'delivered' } },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: {
                if: { $ne: ['$grandTotalPrice', null] },
                then: '$grandTotalPrice',
                else: '$totalPrice',
              },
            },
          },
        },
      },
    ]);
    return totalRevenue[0].totalRevenue;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// compute total number of products
const computeTotalProducts = asyncHandler(async () => {
  try {
    const totalProducts = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: '$stock' },
        },
      },
    ]);
    return totalProducts[0].totalProducts;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// compute total number of users
const computeTotalUsers = asyncHandler(async () => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    return totalUsers;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// compute total categories
const computeTotalCategories = asyncHandler(async () => {
  try {
    const totalCategories = await Category.countDocuments();
    return totalCategories;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// compute monthly earning
const computeMonthlySales = asyncHandler(async () => {
  try {
    const monthlySales = await Order.aggregate([
      {
        $match: { orderStatus: 'delivered' },
      },
      {
        $project: { totalPrice: 1, grandTotalPrice: 1, createdAt: 1 },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$createdAt',
            },
          },
          totalSales: {
            $sum: {
              $cond: {
                if: { $ne: ['$grandTotalPrice', null] },
                then: '$grandTotalPrice',
                else: '$totalPrice',
              },
            },
          },
        },
      },
    ]);
    return monthlySales;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// compute monthly order data for graph
const computeMonthlyOrders = asyncHandler(async () => {
  try {
    const monthlyOrders = await Order.aggregate([
      {
        $group: {
          _id: {
            $month: { $toDate: '$createdAt' },
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          count: '$count',
        },
      },
      {
        $sort: {
          month: 1,
        },
      },
    ]);
    // console.log('monthlyOrders: ', monthlyOrders);

    // create array representing 12 months
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      count: 0,
    }));

    // merge monthly orders with months array
    const ordersInEachMonth = months.map((m) => {
      const result = monthlyOrders.find((r) => r.month === m.month);
      return result || m;
    });
    return ordersInEachMonth;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// compute no. of orders delivered in each category
const computeCategoryWiseDelivered = asyncHandler(async () => {
  try {
    const result = await Order.aggregate([
      {
        $match: { orderStatus: 'delivered' },
      },
      {
        $unwind: '$products',
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.prodId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: '$product',
      },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: '$products.quantity' },
        },
      },
    ]);
    const countByCategory = {};
    result.forEach((item) => {
      countByCategory[item._id] = item.count;
    });
    return countByCategory;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = {
  computeTotalOrders,
  computeTotalRevenue,
  computeTotalProducts,
  computeTotalUsers,
  computeTotalCategories,
  computeMonthlySales,
  computeMonthlyOrders,
  computeCategoryWiseDelivered,
};
