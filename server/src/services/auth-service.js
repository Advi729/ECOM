const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user-model');

// create JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '2d',
    }
  );
}

// Adding user details to the collection
const registerUser = async (userData) => {
  const { firstName, lastName, email, mobile, password } = userData;

  console.log('userxxxxxx: ', userData);
  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if(existingUser) {
    const error = new Error('Email or mobile number already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    email,
    mobile,
    password: hashedPassword,
  });

  const token = generateToken(user);
  user.password = undefined;

  return {
    user,
    token,
  };
};

// To login the user
const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password');

  if(!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401
    throw error;
  }

  if(user.isBlocked) {
    const error = new Error("Your account has been blocked");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if(!isPasswordCorrect) {
    const error = new Error('Invalid email of password');
    error.statusCode = 401;
  }

  const token=  generateToken(user);
  user.password = undefined;

  return {
    user,
    token,
  };
};

// Get user details by id
const getMe = async (userId) => {
  // const user = await User.findById(userId).select('-password');
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

