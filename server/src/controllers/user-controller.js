const asyncHandler = require('express-async-handler');
const userService = require('../services/user-service');

const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.findUsers();
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});


module.exports = {
  getUsers,
};