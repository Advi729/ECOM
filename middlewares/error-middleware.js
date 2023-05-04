const mongoose = require('mongoose');

// Not found
const notFound = (req, res, next) => {
  const error = new Error(`Not Found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler
const errorHandler = (err, req, res, next) => {
  console.log('resssssssssss: ', err.status);
  // const statuscode = res.statusCode === 200 ? 500 : res.statusCode;
  const statusCode = err.status || 500;
  res.status(statusCode);
  // res.json({
  //   message: err?.message,
  //   stack: err?.stack,
  // });
  // res.render('error', {
  //   message: err?.message,
  //   isUser: false,
  //   isAdmin: false,
  //   status: statuscode,
  // });

  // if (res.headersSent) {
  //   return next(error);
  // }
  // res.status(500);
  // res.render('error', { message: 'Internal server error' });
  // console.log('error session: ', req.session);

  if (req.session && req.session.admin && !req.session.user) {
    // Render admin error page
    res.render('admin/error', {
      message: err?.message,
      isUser: false,
      isAdmin: true,
      status: statusCode,
      admin: req.session.admin,
    });
  } else if (req.session && req.session.user && !req.session.admin) {
    // Render user error page
    res.render('user/error', {
      message: err?.message,
      isUser: true,
      isAdmin: false,
      status: statusCode,
      user: req.session.user,
    });
  } else if (!req.session.user && !req.session.admin) {
    // Render user error page
    res.render('user/error', {
      message: err?.message,
      isUser: true,
      isAdmin: false,
      status: statusCode,
      user: req.session.user,
    });
  } else {
    res.render('error', {
      message: err?.message,
      isUser: false,
      isAdmin: false,
      status: statusCode,
    });
  }

  //   if (err instanceof mongoose.Error.CastError) {
  //     // return 404 status code for invalid document ID
  //     return res.status(404).render('error', {
  //       message: 'Product not found',
  //       isUser: false,
  //       isAdmin: false,
  //       status: 404,
  //     });
  //   }
  //   if (err instanceof mongoose.Error.ValidationError) {
  //     // return 400 status code for validation error
  //     return res.status(400).render('error', {
  //       message: err.message,
  //       isUser: false,
  //       isAdmin: false,
  //       status: 400,
  //     });
  //   }
  //   // return 500 status code for other errors
  //   return res.status(500).render('error', {
  //     message: err.message,
  //     isUser: false,
  //     isAdmin: false,
  //     status: 500,
  //   });
};

module.exports = { notFound, errorHandler };
