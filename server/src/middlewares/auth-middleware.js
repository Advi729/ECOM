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

module.exports = protect;