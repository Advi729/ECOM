const asyncHandler = require('express-async-handler');
const brandHelpers = require('../helpers/brand-helper');

// Get All brands
const getAllbrands = asyncHandler(async (req, res, next) => {
  try {
    const { admin } = req.session;
    const findAllBrands = await brandHelpers.allBrands();
    // console.log(findAllBrands);
    res.render('admin/add-brand', {
      isAdmin: true,
      admin,
      brands: findAllBrands,
      brandAddedSuccess: req.session.brandAddedSuccess,
      brandDeletedSuccess: req.session.brandDeletedSuccess,
      brandRestoredSuccess: req.session.brandRestoredSuccess,
      brandAddValidationError: req.session.brandAddValidationError,
    });
    req.session.brandAddedSuccess = false;
    req.session.brandDeletedSuccess = false;
    req.session.brandRestoredSuccess = false;
    req.session.brandAddValidationError = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Create a brand POST method
const createBrand = asyncHandler(async (req, res, next) => {
  try {
    // console.log(req.body);
    const createdBrand = await brandHelpers.addBrand(req);
    // console.log('createdccc:', createdBrand);
    if (createdBrand) {
      req.session.brandAddedSuccess = `You have successfully added brand ${createdBrand.title}`;
      res.redirect('/admin/add-brand');
    } else {
      req.session.brandAddedSuccess = false;
      res.redirect('/admin/add-brand');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET edit brand page
const getEditBrand = asyncHandler(async (req, res, next) => {
  try {
    const { admin } = req.session;
    const { slug } = req.params;
    const findSingleBrand = await brandHelpers.findBrand(slug);
    // console.log(findAllBrands);
    res.render('admin/edit-brand', {
      isAdmin: true,
      admin,
      brand: findSingleBrand,
      brandEditedSuccess: req.session.brandEditedSuccess,
      brandEditValidationError: req.session.brandEditValidationError,
    });
    req.session.brandEditedSuccess = false;
    req.session.brandEditValidationError = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST edit brand page
const postEditBrand = asyncHandler(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const editedBrand = await brandHelpers.updateBrand(slug, req);

    if (editedBrand) {
      req.session.brandEditedSuccess =
        'You have successfully edited the brand.';
      res.redirect(`/admin/edit-brand/${slug}`);
    } else {
      res.redirect(`/admin/edit-brand/${slug}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Delete a brand
const getDeleteBrand = asyncHandler(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedBrand = await brandHelpers.deleteBrand(slug);
    if (deletedBrand) {
      req.session.brandDeletedSuccess = `You have successfully deleted brand ${deletedBrand.title}`;
      res.redirect('/admin/add-brand');
    } else {
      req.session.brandDeletedSuccess = false;
      res.redirect('/admin/add-brand');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Restore a brand
const getRestoreBrand = asyncHandler(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const restoredBrand = await brandHelpers.restoreBrand(slug);
    if (restoredBrand) {
      req.session.brandRestoredSuccess = `You have successfully restored brand ${restoredBrand.title}`;
      res.redirect('/admin/add-brand');
    } else {
      req.session.brandRestoredSuccess = false;
      res.redirect('/admin/add-brand');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = {
  getAllbrands,
  createBrand,
  getEditBrand,
  postEditBrand,
  getDeleteBrand,
  getRestoreBrand,
};
