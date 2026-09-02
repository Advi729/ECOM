const express = require('express');
const authController = require('../controllers/auth-controller');
const {
  registerValidation,
  loginValidation,
} = require('../validation/auth-validation');
const validate = require('../middlewares/validation-middleware');
const protect = require('../middlewares/auth-middleware');
const { getMe } = require('../controllers/auth-controller');

const router = express.Router();

router.post('/register',
  registerValidation,
  validate,
  authController.registerUser
);

router.post('/login', loginValidation, validate, authController.loginUser);

router.get('/me', protect, getMe);



module.exports = router;
