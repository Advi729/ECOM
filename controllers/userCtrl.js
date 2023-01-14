const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { generateToken } = require('../config/jwtToken');
const { generateRefreshToken } = require('../config/refreshToken');
const { getAllProducts } = require('../controllers/productCtrl');


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
        res.render('user/home',{newUser,user:true});

        
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
        const allProducts = getAllProducts();
        res.render('user/home',{allProducts,user:true});

    } else {
        res.redirect('/login');
        throw new Error('Invalid Credentials.');
    }
});  

//Admin-login GET
const loginAdminGet = asyncHandler(async (req, res) => {
    res.render('admin/login',{admin:true});
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
        res.json({
            _id: findAdmin ?. _id,
            firstname: findAdmin ?. firstname,
            lastname: findAdmin ?. lastname,
            email: findAdmin ?. email,
            mobile: findAdmin ?. mobile,
            token: generateToken(findAdmin ?. _id),
            // role: findUser ?. role
        });
        
        getAllProducts();
       
    } else {
        res.redirect('/admin-login');
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
 };