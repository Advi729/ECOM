const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

//check
// const { email } = req.body;
// const adUser = await User.findOne({email});
// if(adUser ?. role === "admin") { 
//     res.render('admin/dashboard',{findAllProducts,admin:true});
// } else {
//     // next();
//     res.render('user/home',{findAllProducts,user:true});
// }