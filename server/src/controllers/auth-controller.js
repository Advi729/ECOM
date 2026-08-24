const asyncHandler = require('express-async-handler');
const authService = require('../services/auth-service');

// User account registration
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

// User account login
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

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.userId);

  res.status(200).json({
    success: true,
    user,
  });
});


module.exports = {
  register,
  login,
  getMe,
};