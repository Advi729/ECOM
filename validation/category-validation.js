const { check } = require('express-validator');
const { validationResult } = require('express-validator');

const validateCategory = [
  check('title')
    .notEmpty()
    .withMessage('Category title is required.')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters.'),
  check('description')
    .notEmpty()
    .withMessage('Description cannot be empty.')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters.'),
  //   body('subCategory[]')
  //     .notEmpty()
  //     .withMessage('Please select at least one sub-category'),
  //   body('subCategory[]').custom((value, { req }) => {
  //     if (!value || value.length === 0) {
  //       throw new Error('Sub-Category is required');
  //     }
  //     return true;
  //   }),
  //   check('subCategory[]').exists().withMessage('Sub-Category is Required.'),
  // .isString()
  // .withMessage('Sub-category must be a String.'),
  //  .isIn(['Banana', 'Apple', 'Orange'])
  //  .withMessage('Fruit does contain invalid value')
  // .notEmpty()
  // .withMessage('Sub-category cannot be empty.'),
  // .isArray()
  // .withMessage('Sub-category must be an array.'),
  // .custom((value, { req }) => {
  //   for (let i = 0; i < value.length; i++) {
  //     if (!isString(value[i])) {
  //       throw new Error('Sub-category must be a string.');
  //     }
  //   }
  //   return true;
  // })
  // .withMessage('Sub-category must be an array of strings.'),
];

const validateAdd = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    req.session.categoryAddValidationError = errorMessages;
    res.redirect(`/admin/add-category`);
  } else {
    next();
  }
};

const validateEdit = (req, res, next) => {
  const errors = validationResult(req);
  const { slug } = req.params;
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    req.session.categoryEditValidationError = errorMessages;
    res.redirect(`/admin/edit-category/${slug}`);
  } else {
    next();
  }
};

module.exports = { validateCategory, validateAdd, validateEdit };
