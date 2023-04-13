/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');

// tgp code
const authMiddleware = asyncHandler(async (req, res, next) => {
  // extract the JWT token from the "Authorization" header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('Not authorized. No JWT token found in request header.');
  }
  const token = authHeader.split(' ')[1];
  // eslint-disable-next-line no-console
  console.log('authmiddd:::::::', token);
  try {
    // verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // fetch the user associated with the token from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('Not authorized. User associated with token not found.');
    }
    // set the user object in the request for use in subsequent middleware
    req.user = user;
    next();
  } catch (err) {
    throw new Error('Not authorized. Invalid or expired JWT token.');
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  const { email } = req.user;
  const adminUser = await User.findOne({ email });
  if (adminUser.role !== 'admin') {
    throw new Error('You are not an Admin.');
  } else {
    next();
  }
});

// const isUser = asyncHandler(async (req, res, next) => {
//   console.log('userrrrrrrrrrrrrrr',req.session.user);
//   if (req.session.user) {
//     next();
//   } else {
//     // res.redirect('/login');
//     window.location.href = '/login';
//   }
// });

const isUser = asyncHandler(async (req, res, next) => {
  if (req.session.user) {
    next();
  } else if (req.xhr) {
    // AJAX request, send error response
    res
      .status(401)
      .send({ error: 'User not authenticated', redirectUrl: '/login' });
  } else {
    // Regular request, redirect to login page
    res.redirect('/login');
  }
});

// eslint-disable-next-line consistent-return
const loggedInSession = asyncHandler(async (req, res, next) => {
  // Get the token from the request header
  const token = req.headers.authorization;

  if (token) {
    try {
      // Verify the token using your secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Set the decoded token on the request object for later use
      req.user = decoded;
    } catch (err) {
      // If the token is invalid or has expired, ignore it and proceed
      // eslint-disable-next-line no-console
      console.error('Invalid or expired token:', err.message);
    }
  }

  // Check if the user is already logged in
  if (req.user) {
    // If the user is already logged in, return an error
    return res.status(403).json({ message: 'User is already logged in' });
  }

  // Call next to proceed to the next middleware or route handler
  next();
});

// To check admin is logged in
const adminCheck = asyncHandler(async (req, res, next) => {
  if (req.session.admin) {
    next();
  } else if (req.xhr) {
    // AJAX request, send error response
    res
      .status(401)
      .send({ error: 'Admin not authenticated', redirectUrl: '/admin/login' });
  } else {
    res.redirect('/admin/login');
    // res.redirect('/admin');
  }
});

// To check admin is present, else login
const adminAuthentication = asyncHandler(async (req, res, next) => {
  if (req.session.admin) {
    res.redirect('/admin');
  } else {
    next();
  }
});

module.exports = {
  adminCheck,
  adminAuthentication,
  authMiddleware,
  isAdmin,
  isUser,
  loggedInSession,
};
