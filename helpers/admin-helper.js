const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');

// Login Admin
const adminLogin = asyncHandler(async (data) => {
  try {
    const { email, password } = data;
    const response = {};
    const findAdmin = await User.findOne({ email });
    // console.log(req.body);
    if (findAdmin && findAdmin.role === 'admin') {
      const adminPassword = await findAdmin.isPasswordMatched(password);
      if (adminPassword) {
        response.admin = findAdmin;
        response.status = true;
        return response;
      }
      return { status: false };
    }
    return { notExist: true };
  } catch (error) {
    throw new Error();
  }
});

// Gather details of all users
const findAllUsers = asyncHandler(async () => {
  try {
    const findUsers = await User.find({ role: 'user' });
    const foundUsers = JSON.parse(JSON.stringify(findUsers));
    if (foundUsers) {
      return foundUsers;
    }
  } catch (error) {
    throw new Error();
  }
});

// update block status of user
const updateBlockStatus = asyncHandler(async (id) => {
  try {
    const response = {};
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    if (block) {
      response.status = true;
      return response;
    }
    return { status: false };
  } catch (error) {
    throw new Error();
  }
});

// update block status of user
const updateUnBlockStatus = asyncHandler(async (id) => {
  try {
    const response = {};
    const unBlock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    if (unBlock) {
      response.status = true;
      return response;
    }
    return { status: false };
  } catch (error) {
    throw new Error();
  }
});

module.exports = {
  adminLogin,
  findAllUsers,
  updateBlockStatus,
  updateUnBlockStatus,
};
