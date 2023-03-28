const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');

// To create new document in User collection
const userSignUp = asyncHandler(async (data) => {
  try {
    const { email, mobile } = data;
    let response = {};
    console.log('email&number:-> ', email, mobile);
    const findUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    console.log('findUser:::', findUser);
    if (findUser) {
      return { status: true };
    }
    const userCreated = await User.create(data);
    // console.log('userCreated:::', userCreated);
    response = userCreated;
    if (userCreated) {
      return { response, status: false };
    }
  } catch (error) {
    throw new Error();
  }
});

// To login the User
const userLogin = asyncHandler(async (data) => {
  try {
    let response = {};
    const { email, password } = data;
    const userData = await User.findOne({ email });
    response = userData;
    if (userData) {
      if (userData.isBlocked === false) {
        const userPassword = await userData.isPasswordMatched(password);
        if (userPassword) {
          return { response, status: true };
        }
        return { status: false, blockedStatus: false };
      }
      return { status: false, blockedStatus: true };
    }
    return { status: false, blockedStatus: false };
  } catch (error) {
    throw new Error();
  }
});

// To check if the registered number is entered for OTP
const findOtp = asyncHandler(async (enteredMobile) => {
  try {
    let response = {};
    const findUser = await User.findOne({ mobile: enteredMobile });
    response = findUser;
    return { response };
  } catch (error) {
    throw new Error();
  }
});

module.exports = { userSignUp, userLogin, findOtp };
