const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// const authMiddleware = asyncHandler(async (req, res, next) => {
//     console.log('i love u');
//     let token;
//     if(req?.headers?.authorization?.startsWith("Bearer")) {
//         token = req.headers.authorization.split(" ")[1];
//         console.log('88888888888888888888888888888888888:\n',token);
//         try {
//             if(token) {
//                 const decoded = jwt.verify(token, process.env.JWT_SECRET);
//                 // console.log(decoded);
//                 const user = await User.findById(decoded?.id);
//                 if (!user) {
//                     throw new Error("Not authorized. User associated with token not found.");
//                 }
//                 req.user = user;
//                 next();
//             }
//         } catch (error) {
//             throw new Error("Not Authorized, token expired. Please login again")
//         }
//     } else {
//         throw new Error("There is no token attached to header.");
//     }
// });

//tgp code
const authMiddleware = asyncHandler(async (req, res, next) => {
    // extract the JWT token from the "Authorization" header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new Error("Not authorized. No JWT token found in request header.");
    }
    const token = authHeader.split(" ")[1];
    console.log('authmiddd:::::::',token);
    try {
        // verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // fetch the user associated with the token from the database
        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error("Not authorized. User associated with token not found.");
        }
        // set the user object in the request for use in subsequent middleware
        req.user = user;
        next();
    } catch (err) {
        throw new Error("Not authorized. Invalid or expired JWT token.");
    }
});


const isAdmin = asyncHandler(async (req, res, next) => {
    // console.log(req.user);
    const { email } = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin") {
        throw new Error('You are not an Admin.');
    } else {
        next();
    }
});

const loggedInSession = asyncHandler(async(req, res, next) => {
        // Get the token from the request header
        const token = req.headers.authorization;
        
        if (token) {
          try { 
            // Verify the token using your secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Set the decoded token on the request object for later use
            req.user = decoded;
          } catch (err) {
            // If the token is invalid or has expired, ignore it and proceed
            console.error('Invalid or expired token:', err.message);
          }
        }
      
        // Check if the user is already logged in
        if (req.user) {
          // If the user is already logged in, return an error
          return res.status(403).json({ message: 'User is already logged in' });
        }  
      
        // Call next to proceed to the next middleware or route handler
        next();
     
});


module.exports = { authMiddleware, isAdmin, loggedInSession };