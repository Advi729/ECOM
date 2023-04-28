const asyncHandler = require('express-async-handler');
const bannerHelpers = require('../helpers/banner-helper');

// Get banner add page
const getAddBanner = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const allBanners = await bannerHelpers.findAllBanners();
    res.render('admin/add-banner', { admin, isAdmin: true, allBanners });
  } catch (error) {
    throw new Error(error);
  }
});

// Get banner add page
const postAddBanner = asyncHandler(async (req, res) => {
  try {
    const edited = await bannerHelpers.addBanner(req);
    if (edited) res.redirect('/admin/add-banner');
  } catch (error) {
    throw new Error(error);
  }
});

// Get banner edit page
const getEditBanner = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const { id } = req.params;
    const banner = await bannerHelpers.findSingleBanner(id);
    res.render('admin/edit-banner', { admin, isAdmin: true, banner });
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
});

// Get banner edit page
const postEditBanner = asyncHandler(async (req, res) => {
  try {
    const added = await bannerHelpers.editBanner(req);
    if (added) res.redirect('/admin/add-banner');
  } catch (error) {
    throw new Error(error);
  }
});

// Delete banner
const deleteBanner = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await bannerHelpers.deleteTheBanner(id);
    if (deleted) res.redirect('/admin/add-banner');
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getAddBanner,
  postAddBanner,
  deleteBanner,
  getEditBanner,
  postEditBanner,
};
