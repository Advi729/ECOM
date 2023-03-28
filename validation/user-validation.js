const { check } = require('express-validator');

const userLogin = [
  check('email')
    .notEmpty()
    .withMessage('Username is required.')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .trim(),
  check('password').notEmpty().withMessage('Password is required').trim(),
];

const userOtpLogin = [
  check('mobile')
    .notEmpty()
    .withMessage('Mobile number cannot be empty.')
    .isNumeric()
    .withMessage('Mobile number should be digits.')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number should have 10 digits.')
    .matches(/^(0)?[6789]\d{9}$/)
    .withMessage('Mobile number is not valid'),
];

const userSignUp = [
  check('firstname')
    .notEmpty()
    .withMessage('First name cannot be empty.')
    .isLength({ min: 1 })
    .withMessage('First name should have atleast one letter.')
    .trim(),
  check('lastname')
    .notEmpty()
    .withMessage('Last name cannot be empty.')
    .isLength({ min: 1 })
    .withMessage('Last name should have atleast one letter.')
    .trim(),
  check('email')
    .notEmpty()
    .withMessage('Username is required.')
    .isEmail()
    .withMessage('Please enter your valid email address')
    .trim(),
//   check('mobileNumber')
//     .notEmpty()
//     .withMessage('Mobile number cannot be empty.')
//     .isNumeric()
//     .withMessage('Mobile number should be digits.')
//     .isLength({ min: 10, max: 10 })
//     .withMessage('Mobile number should have 10 digits.')
//     .matches(/^(0)?[6789]\d{9}$/)
//     .withMessage('Mobile number is not valid'),
  check('mobile')
    .notEmpty()
    .withMessage('Mobile number cannot be empty')
    .isLength({ min: 10, max: 10 })
    .withMessage('Mobile number should have 10 numbers')
    .matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)
    .withMessage('Mobile number is not valid'),
  check('password')
    .notEmpty()
    .withMessage('Password cannot be empty.')
    .isLength({ min: 6, max: 15 })
    .withMessage('Password should have min and max length between 6-15')
    .matches(/\d/)
    .withMessage('Password should have at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password should have at least one sepcial character')
    .trim(),
];

module.exports = { userLogin, userOtpLogin, userSignUp };
