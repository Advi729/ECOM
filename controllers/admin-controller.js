const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');
const Product = require('../models/product-model');
const productHelpers = require('../helpers/product-helper');

// Admin-login GET
const loginAdminGet = asyncHandler(async (req, res) => {
  res.render('admin/login');
  // res.render('admin/login', { admin: true });
});
// Admin login POST
const loginAdminPost = asyncHandler(async (req, res) => {
  // res.redirect('/admin/login-admin');
  // res.redirect('/admin/login')

  const { email, password } = req.body;
  // console.log(email,password);
  // admin validation
  const findAdmin = await User.findOne({ email });
  // console.log(req.body);
  if (findAdmin.role !== 'admin') throw new Error('You are not authorized.');
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    // res.json(findAdmin);
    const refreshToken = await generateRefreshToken(findAdmin?.id);
    const updateAdmin = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken,
      },
      { new: true }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
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
    res.render('admin/dashboard', { admin: true });
    // getAllProducts();
  } else {
    res.redirect('/admin');
    throw new Error('Invalid Credentials.');
  }
});

// Handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log(cookie);
  if (!cookie?.refreshToken) throw new Error('No refresh token in cookie.');
  const { refreshToken } = cookie;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error('No refresh token present in db or not matched.');
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id)
      throw new Error('There is something wrong with refresh token.');
    const accessToken = generateToken(user?.id);
    res.json({ accessToken });
  });
});

// Update a user

// Get details of all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json({ getUsers });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a user
const deleteaUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
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
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json({
      message: 'User Blocked.',
    });
  } catch (error) {
    throw new Error(error);
  }
});

// Unblock a user
const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: 'User Un-Blocked.',
    });
  } catch (error) {
    throw new Error(error);
  }
});
