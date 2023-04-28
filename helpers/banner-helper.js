const asyncHandler = require('express-async-handler');
const Banner = require('../models/banner-model');

// Add banner
const addBanner = asyncHandler(async (data) => {
  try {
    console.log('req.body:  ', data.body);
    await console.log('req.image:  ', data);
    const bannerData = {
      ...data.body,
      image: data.file.filename,
    };
    const added = await Banner.create(bannerData);
    if (added) return added;
  } catch (error) {
    throw new Error(error);
  }
});

// Edit banner
const editBanner = asyncHandler(async (data) => {
  try {
    console.log('data.body: ', data.body);
    const { id } = data.params;
    const updated = await Banner.updateOne(
      { _id: id },
      {
        $set: {
          name: data.body.name,
          heading1: data.body.heading1,
          heading2: data.body.heading2,
          subHeading: data.body.subHeading,
          image: data.body.image,
        },
      }
    );
    return updated;
  } catch (error) {
    throw new Error(error);
  }
});

// Find all banners
const findAllBanners = asyncHandler(async () => {
  try {
    const findBanners = await Banner.find().sort({ createdAt: -1 });
    const foundBanners = JSON.parse(JSON.stringify(findBanners));
    if (foundBanners) return foundBanners;
  } catch (error) {
    throw new Error(error);
  }
});

// Find a single banner
const findSingleBanner = asyncHandler(async (id) => {
  try {
    const findBanner = await Banner.findOne({ _id: id });
    const foundBanner = JSON.parse(JSON.stringify(findBanner));
    if (foundBanner) return foundBanner;
  } catch (error) {
    throw new Error(error);
  }
});

// Delete the banner
const deleteTheBanner = asyncHandler(async (id) => {
  try {
    const deleted = await Banner.deleteOne({ _id: id });
    if (deleted) return deleted;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addBanner,
  findAllBanners,
  deleteTheBanner,
  findSingleBanner,
  editBanner,
};
