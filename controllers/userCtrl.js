const User = require('../models/userModel');
const Product = require('../models/productModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const { getAllProducts } = require('../controllers/productCtrl');
const twilio = require('twilio');
const { send_otp, verifying_otp } = require('../middlewares/twilio');
// const { allProducts } = require('../helpers/productHelpers');
const productHelpers = require("../helpers/productHelpers");


const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid, authToken);



//User sign up GET 
const createUserGet = asyncHandler(async (req, res) => {
    res.render('user/signup',{user:true});
});


//User sign up POST
const createUserPost = asyncHandler(async(req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ "email": email});
    if(!findUser) {
        //create new user
        const newUser = await User.create(req.body);
        // res.json(newUser);

        let newusername = newUser.firstname;
        // res.render('user/home',{newusername,user:true});
        let products = req.productsAll;
        // console.log(products);
        res.render('user/home',{newusername, allProducts: products, user: true});
        
    } else {
        //user already exists
        // res.json({ 
        //     msg: 'User Already Exists',
        //     success: false
        // })
        res.redirect('/signup');
        throw new Error('User already exists.');
    } 
});  

//User login GET
const loginUserGet = asyncHandler(async (req, res) => {
    res.render('user/login',{user:true});
});

//User login GET using OTP
const loginUserGetOTP = asyncHandler(async (req, res) => {
    res.render('user/otp-form',{user:true});
});

// //generate otp
// const generateOTP = () => {
//     const digits = '0123456789';
//     let OTP = '';
//     for (let i = 0; i < 6; i++) {
//       OTP += digits[Math.floor(Math.random() * 10)];
//     }
//     return OTP;
// };
// //send otp
// const sendOTP = (mobileNumber, otp) => {
//     client.messages.create({
//       to: mobileNumber,
//       from: '+15074872503',  // twilio phone number
//       body: `Your OTP for login is ${otp}`,
//     })
//     .then(message => console.log(message.sid))
//     .catch(err => console.log(err));
// }
  
// User login POST using OTP
const loginUserPostOTP = asyncHandler((req, res) => {
  const mobileNumber = req.body.mobileNumber;
//   const otp = generateOTP();
  send_otp(mobileNumber).then((response) => {
    // const mobileNumber = req.body.mobileNumber;
    res.render('user/otp', { title: 'OTP Verification', mobileNumber: mobileNumber });
  })
}); 
 
// User login otp verify
const verifyOtp = async (req, res) => {
    const mobileNumber = req.body.mobileNumber;
    const otp = req.body.otp;
    // Verify the OTP
    verifying_otp(mobileNumber, otp).then((verification) => {
        
        let products = req.productsAll;
        res.render('user/home',{allProducts: products, user: true});
        // here we need to send username
    })
  };
   
//User login POST
const loginUserPost = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // console.log(email,password);
    //user validation
    const findUser = await User.findOne({"email": email});
    if(findUser && (await findUser.isPasswordMatched(password))) {
        // res.json(findUser);
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken,
            },
            { new:true }
            );
        res.cookie("refreshToken", refreshToken, 
        {
            httpOnly:true,
            maxAge: 72 * 60 * 60 * 1000
        });
        // res.json({
        //     _id: findUser ?. _id,
        //     firstname: findUser ?. firstname,
        //     lastname: findUser ?. lastname,
        //     email: findUser ?. email,
        //     mobile: findUser ?. mobile,
        //     token: generateToken(findUser ?. _id),
        //     // role: findUser ?. role
        // });
        // const allProducts = getAllProducts();

        // console.log(findUser.firstname);
        // res.render('user/home',{findUser, user:true});
        let username = findUser.firstname;  //working

        // let prods = productHelpers.allProducts();
        // console.log('prods:',prods);

        // res.render('user/home',{username, allProducts: prods, user:true});  // working

        let products = req.productsAll;
        // console.log(products);
        res.render('user/home',{username, allProducts: products, user: true});

    } else {
        res.redirect('/login');
        throw new Error('Invalid Credentials.');
    }
});   
 
//Admin-login GET
const loginAdminGet = asyncHandler(async (req, res) => {
    res.render('admin/login');
    // res.render('admin/login',{admin:true});
});
//Admin login POST
const loginAdminPost = asyncHandler(async (req, res) => {
    // res.redirect('/admin/login-admin');
    // res.redirect('/admin/login')

    const { email, password } = req.body;
    // console.log(email,password);
    //admin validation
    const findAdmin = await User.findOne({"email": email});
    // console.log(req.body);
    if(findAdmin.role !== 'admin') throw new Error('You are not authorized.');
    if(findAdmin && (await findAdmin.isPasswordMatched(password))) {
        // res.json(findAdmin);
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateAdmin = await User.findByIdAndUpdate(
            findAdmin.id,
            {
                refreshToken: refreshToken,
            },
            { new:true }
            );
        res.cookie("refreshToken", refreshToken, 
        {
            httpOnly:true,
            maxAge: 72 * 60 * 60 * 1000
        });
        // res.json({
        //     _id: findAdmin ?. _id,
        //     firstname: findAdmin ?. firstname,
        //     lastname: findAdmin ?. lastname,
        //     email: findAdmin ?. email, 
        //     mobile: findAdmin ?. mobile,
        //     token: generateToken(findAdmin ?. _id),
        //     // role: findUser ?. role
        // });

        // res.cookie("adminId", findAdmin?._id, {
        //     httpOnly: true,
        //     maxAge: 72 * 60 * 60 * 1000,
        //   });
          
        // res.cookie("adminToken", generateToken(findAdmin?._id), {
        //     httpOnly: true,
        //     maxAge: 72 * 60 * 60 * 1000,
        //   }); 

        const token = generateToken(findAdmin?._id);
        // console.log(token);
        res.set('Authorization', `Bearer ${token}`);
        // console.log(res);
// can send newDetails while rendering 
//         const newDetails =  {
//           _id: findAdmin ?. _id,
//              firstname: findAdmin ?. firstname,
//              lastname: findAdmin ?. lastname,
//              email: findAdmin ?. email, 
//              mobile: findAdmin ?. mobile,
//              token: generateToken(findAdmin ?. _id),
//          role: findUser ?. role
//          };


        // const allAdminProducts = getAllProducts();
        // res.render('admin/dashboard',{allAdminProducts,admin:true});
        res.render('admin/dashboard',{admin:true});
        // getAllProducts();
       
    } else {
        res.redirect('/admin');
        throw new Error('Invalid Credentials.');
    }
});

//Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken) throw new Error('No refresh token in cookie.');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) throw new Error('No refresh token present in db or not matched.');
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err || user.id !== decoded.id) throw new Error('There is something wrong with refresh token.');
        const accessToken = generateToken(user?.id);
        res.json({accessToken});
    });
});
 
// logout user
    const logoutUser = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if(!cookie?.refreshToken) throw new Error('No refresh token in cookie.');
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if(!user) {
        res.clearCookie("refreshToken", 
        {
            httpOnly:true,
            secure:true
        });
        res.sendStatus(204); //forbidden
    } 
    await User.findOneAndUpdate(
        refreshToken,
        { "refreshToken": " " }  
    );
    res.clearCookie("refreshToken", 
        {
            httpOnly:true,
            secure:true
        });
    // res.redirect('/user/home');
    res.redirect('/');
    res.sendStatus(204);
        
});


//Update a user


//Get details of all users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json({getUsers});
    } catch (error) {
        throw new Error(error);
    }
});

//Get details of a user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(req.params);
    try{
        const getUser = await User.findById(id);
        res.json({getUser});
    } catch(error) {
        throw new Error(error);
    }
});

//Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    console.log(req.params);
    try{
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({deleteUser});
    } catch(error) {
        throw new Error(error);
    }
});

// Block a user
const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const block = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: true
            },
            {
                new:true
            }
        );
        res.json({
            message: 'User Blocked.'
        }); 
    } catch (error) {
        throw new Error(error);
    }
});


//Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked: false
            },
            {
                new:true
            }
        );
        res.json({
            message: 'User Un-Blocked.'
        }); 
    } catch (error) {
        throw new Error(error);
    } 
});

module.exports = { 
    createUserGet,
    createUserPost, 
    loginUserGet, 
    loginUserPost,
    loginAdminGet,
    loginAdminPost,
    getAllUsers, 
    getaUser, 
    deleteaUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logoutUser,
    loginUserGetOTP,
    loginUserPostOTP,
    verifyOtp
 };