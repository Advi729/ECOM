const jwt = require('jsonwebtoken');

// create JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '2d',
    }
  );
}

module.exports = generateToken;