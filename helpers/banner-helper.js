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
    console.error(error);
    throw error;
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
          heading: data.body.heading,
          subHeading: data.body.subHeading,
          footer: data.body.footer,
          image: data.body.image,
        },
      }
    );
    return updated;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Find all banners
const findAllBanners = asyncHandler(async () => {
  try {
    const findBanners = await Banner.find().sort({ createdAt: -1 });
    const foundBanners = JSON.parse(JSON.stringify(findBanners));
    if (foundBanners.length !== 0) {
      return foundBanners;
    }
    const error = new Error('An error occured while finding banners');
    error.status = 404;
    throw error;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Find a single banner
const findSingleBanner = asyncHandler(async (id) => {
  try {
    const findBanner = await Banner.findOne({ _id: id });
    const foundBanner = JSON.parse(JSON.stringify(findBanner));
    if (foundBanner) {
      return foundBanner;
    }
    const error = new Error('Banner not found');
    error.status = 404;
    throw error;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

// Delete the banner
const deleteTheBanner = asyncHandler(async (id) => {
  try {
    const deleted = await Banner.deleteOne({ _id: id });
    if (deleted) return deleted;
  } catch (error) {
    console.error(error);
    throw error;
  }
});

module.exports = {
  addBanner,
  findAllBanners,
  deleteTheBanner,
  findSingleBanner,
  editBanner,
};
