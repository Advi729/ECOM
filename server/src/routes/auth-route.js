const express = require('express');
const authController = require('../controllers/auth-controller');
const {
  registerValidation,
  loginValidation,
} = require('../validation/auth-validation');
const validate = require('../middlewares/validation-middleware');

const router = express.Router();

router.post('/register',
  registerValidation,
  validate,
  authController.register
);

router.post('/login', loginValidation, validate, authController.login);



module.exports = router;
