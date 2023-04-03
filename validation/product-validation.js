const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const validateProduct = [
  check('title')
    .notEmpty()
    .withMessage('Product title is required.')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters.'),
  check('description')
    .notEmpty()
    .withMessage('Description cannot be empty.')
    .isLength({ max: 600 })
    .withMessage('Description cannot exceed 600 characters.'),
  check('price')
    .notEmpty()
    .withMessage('Price cannot be empty.')
    .isNumeric()
    .withMessage('Price should be a number.')
    .isFloat({ min: 0.01 })
    .withMessage('Price should be at least 0.01.'),
  check('quantity')
    .notEmpty()
    .withMessage('Quantity cannot be empty.')
    .isInt({ min: 0 })
    .withMessage('Quantity should be a positive integer.'),
  check('color')
    .notEmpty()
    .withMessage('Color cannot be empty.')
    .isLength({ max: 50 })
    .withMessage('Color cannot exceed 50 characters.'),
  check('category').notEmpty().withMessage('Category cannot be empty.'),
  check('subCategory').notEmpty().withMessage('Sub-category cannot be empty.'),
  check('brand').notEmpty().withMessage('Brand cannot be empty.'),
  // check('images')
  //   .notEmpty()
  //   .withMessage('Images cannot be empty.')
  //   .isArray({ min: 1 })
  //   .withMessage('At least one image is required.'),
  //   .custom((images) => {
  //     const maxFileSize = 5 * 1024 * 1024; // 5MB
  //     for (let i = 0; i < images.length; i++) {
  //       const image = images[i];
  //       const { mimetype, size } = image;
  //       if (!mimetype.startsWith('image/')) {
  //         throw new Error('Only image files are allowed.');
  //       }
  //       if (size > maxFileSize) {
  //         throw new Error('Image file size should not exceed 5MB.');
  //       }
  //     }
  //     return true;
  //   }),
];

// const validate = (req, res, next) => {
//   const errors = validationResult(req);
//   const err = errors.errors;
//   console.log(req.body);
//   console.log('errorProductttt:', err);
//   if (!errors.isEmpty()) {
//     req.session.productValidationError = err[0].msg;
//     res.redirect('/admin/add-product');
//   } else {
//     next();
//   }
// };

const validateAdd = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty() || req.session.imageValidationError) {
    const errorMessages = errors.array().map((error) => error.msg);
    if (req.session.imageValidationError) {
      errorMessages.push(req.session.imageValidationError);
    }
    req.session.productValidationError = errorMessages;
    // console.log(req.session.productValidationError);
    res.redirect('/admin/add-product');
  } else {
    next();
  }
};

const validateEdit = (req, res, next) => {
  const errors = validationResult(req);
  const { slug } = req.params;
  if (!errors.isEmpty() || req.session.imageValidationError) {
    const errorMessages = errors.array().map((error) => error.msg);
    if (req.session.imageValidationError) {
      errorMessages.push(req.session.imageValidationError);
    }
    req.session.editValidationError = errorMessages;
    console.log(req.session.editValidationError);

    res.redirect(`/admin/edit-product/${slug}`);
  } else {
    next();
  }
};

module.exports = { validateProduct, validateAdd, validateEdit };
