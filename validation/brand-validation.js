const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const validateBrand = [
  check('title')
    .notEmpty()
    .withMessage('Brand title is required.')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters.'),
  check('description')
    .notEmpty()
    .withMessage('Description cannot be empty.')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters.'),
];

const validateAdd = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    req.session.brandAddValidationError = errorMessages;
    res.redirect(`/admin/add-brand`);
  } else {
    next();
  }
};

const validateEdit = (req, res, next) => {
  const errors = validationResult(req);
  const { slug } = req.params;
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    req.session.brandEditValidationError = errorMessages;
    res.redirect(`/admin/edit-brand/${slug}`);
  } else {
    next();
  }
};

module.exports = { validateBrand, validateAdd, validateEdit };
