const { check } = require('express-validator');

const adminLogin = [
  check('email')
    .notEmpty()
    .withMessage('Username is required.')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .trim(),
  check('password').notEmpty().withMessage('Password is required').trim(),
];

module.exports = { adminLogin };
