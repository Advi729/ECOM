const { body } = require('express-validator');

const registerValidation = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name cannot be empty.'),
    
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name cannot be empty.'),
    
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(), // Standardizes email formats (e.g., lowercase)

  body('mobile')
    .trim()
    .notEmpty()
    .withMessage('Mobile number cannot be empty.')
    // express-validator now has built-in mobile validation!
    .isMobilePhone('any') 
    .withMessage('Mobile number is not valid.'),

  body('password')
    .notEmpty()
    .withMessage('Password cannot be empty.')
    .isLength({ min: 6, max: 15 })
    .withMessage('Password must be between 6 and 15 characters long.')
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1, 
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password must contain at least one number, one uppercase, one lowercase and one special character.'),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];


module.exports = {
  registerValidation,
  loginValidation,
};
