const asyncHandler = require('express-async-handler');

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
  isUser,
};
