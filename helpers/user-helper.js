const asyncHandler = require('express-async-handler');
const User = require('../models/user-model');

// To create new document in User collection
const userSignUp = asyncHandler(async (data) => {
  try {
    const { email, mobile } = data;
    let response = {};
    // console.log('email&number:-> ', email, mobile);
    const findUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    // console.log('findUser:::', findUser);
    if (findUser) {
      return { status: true };
    }
    const userCreated = await User.create(data);
    // console.log('userCreated:::', userCreated);
    response = userCreated;
    if (userCreated) {
      return { response, status: false };
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// To login the User
const userLogin = asyncHandler(async (data) => {
  try {
    let response = {};
    const { email, password } = data;
    const userData = await User.findOne({ email });
    response = userData;
    if (userData) {
      if (userData.isBlocked === false) {
        const userPassword = await userData.isPasswordMatched(password);
        if (userPassword) {
          return { response, status: true };
        }
        return { status: false, blockedStatus: false };
      }
      return { status: false, blockedStatus: true };
    }
    return { status: false, blockedStatus: false };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// To check if the registered number is entered for OTP
const findOtp = asyncHandler(async (enteredMobile) => {
  try {
    let response = {};
    const findUser = await User.findOne({ mobile: enteredMobile });
    response = findUser;
    return { response };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// find user details using id
const findUser = asyncHandler(async (_id) => {
  try {
    const foundUser = await User.findOne({ _id });
    const finalUser = JSON.parse(JSON.stringify(foundUser));
    if (finalUser) {
      return finalUser;
    }
    const error = new Error('User not found');
    error.status = 404; // set the error status to 404 (Not Found)
    throw error;
  } catch (error) {
    if (error.name === 'CastError') {
      const notFoundError = new Error('User not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    console.error(error);
    throw error;
  }
});

const getDeliveryAddress = asyncHandler(async (userId, deliveryAddressId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const deliveryAddress = user.address.find(
      (address) => address._id.toString() === deliveryAddressId.toString()
    );
    if (!deliveryAddress) {
      throw new Error('Delivery address not found');
    }
    // console.log('ddddaddress:', deliveryAddress);
    return deliveryAddress;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// add address of the user
const addUserAddress = asyncHandler(async (_id, data) => {
  try {
    const { pincode, locality, area, district, state } = data.body;
    if (!pincode || !locality || !area || !district || !state) {
      throw new Error('Missing required address fields');
    }

    // Create new address object
    const newAddress = {
      pincode,
      locality,
      area,
      district,
      state,
    };

    // Find user by ID and add address array
    const createdAddress = await User.findByIdAndUpdate(
      _id,
      { $push: { address: newAddress } },
      { new: true }
    );

    return createdAddress;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// update address of the user
const updateUserAddress = asyncHandler(async (userId, addressId, data) => {
  try {
    const { pincode, locality, area, district, state } = data.body;
    const updated = await User.updateOne(
      { _id: userId, 'address._id': addressId },
      {
        $set: {
          'address.$.pincode': pincode,
          'address.$.locality': locality,
          'address.$.area': area,
          'address.$.district': district,
          'address.$.state': state,
        },
      }
    );
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// delete address of the user
const deleteUserAddress = asyncHandler(async (userId, addressId) => {
  try {
    const deleted = await User.updateOne(
      { _id: userId },
      { $pull: { address: { _id: addressId } } }
    );

    if (deleted.nModified === 0) {
      throw new Error('Address not found.');
    }

    return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Return all slugs of products
const allSlugsInProducts = asyncHandler(async (foundProducts) => {
  try {
    const categories = foundProducts.reduce((acc, product) => {
      if (!acc[product.categorySlug]) {
        acc[product.categorySlug] = true;
      }
      return acc;
    }, {});
    const allCategorySlugs = Object.keys(categories);

    const subCategories = foundProducts.reduce((acc, product) => {
      if (!acc[product.subCategorySlug]) {
        acc[product.subCategorySlug] = true;
      }
      return acc;
    }, {});
    const allSubCategorySlugs = Object.keys(subCategories);

    const brands = foundProducts.reduce((acc, product) => {
      if (!acc[product.brandSlug]) {
        acc[product.brandSlug] = true;
      }
      return acc;
    }, {});
    const allBrandSlugs = Object.keys(brands);

    return { allCategorySlugs, allSubCategorySlugs, allBrandSlugs };
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = {
  userSignUp,
  userLogin,
  findOtp,
  findUser,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getDeliveryAddress,
  allSlugsInProducts,
};
