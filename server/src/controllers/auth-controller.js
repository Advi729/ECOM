const asyncHandler = require('express-async-handler');
const authService = require('../services/auth-service');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: 'User registered successfully.',
    data: {
      user,
      token,
    },
  });
});

const login = asyncHandler(async (req, res) =>{
  const { email, password } = req.body;

  const { user, token } = await authService.loginUser(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token,
    },
  });
});



module.exports = {
  register,
  login,
};