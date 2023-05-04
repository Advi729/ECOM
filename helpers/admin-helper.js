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
    console.error(error);
    throw error;
  }
});

// Gather details of all users
const findAllUsers = asyncHandler(async () => {
  try {
    const findUsers = await User.find({ role: 'user' });
    const foundUsers = JSON.parse(JSON.stringify(findUsers));
    console.log('foundxzuser: ', foundUsers);
    if (foundUsers.length !== 0) {
      return foundUsers;
    }
    const error = new Error('An error occured while finding users');
    error.status = 404; // set the error status to 404 (Not Found)
    throw error;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// update block status of user
const updateBlockStatus = asyncHandler(async (id) => {
  try {
    // const response = {};
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
      // response.status = true;
      return { block, status: true };
    }
    return { status: false };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// update block status of user
const updateUnBlockStatus = asyncHandler(async (id) => {
  try {
    // const response = {};
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
      // response.status = true;
      return { unBlock, status: true };
    }
    return { status: false };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = {
  adminLogin,
  findAllUsers,
  updateBlockStatus,
  updateUnBlockStatus,
};
