const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  
    const authHeader = req.headers.authorization;
    console.log('authheadder::::-',authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated',
      });
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  
};

// middleware to check if admin
const isAdmin = (req, res, next) => {
    console.log('isAdmin: ', req.user);
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied. Admin only.');
  }
};

module.exports = {
  protect,
  isAdmin,
};