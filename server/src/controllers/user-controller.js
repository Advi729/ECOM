const asyncHandler = require('express-async-handler');
const userService = require('../services/user-service');

const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await userService.findUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });

  } catch (error) {
    console.error(error);
    throw error;
  }
});


module.exports = {
  getUsers,
};