const asyncHandler = require('express-async-handler');
const subCategoryHelpers = require('../helpers/sub-category-helper');
const categoryHelpers = require('../helpers/category-helper');

// Get All categories
const getAllSubCategories = asyncHandler(async (req, res, next) => {
  try {
    const { admin } = req.session;
    const findAllSubCategories = await subCategoryHelpers.allSubCategories();
    const findCategories = await categoryHelpers.allCategories();
    console.log(findAllSubCategories);
    // if (findAllSubCategories) {
    res.render('admin/add-sub-category', {
      isAdmin: true,
      admin,
      subCategories: findAllSubCategories,
      categories: findCategories,
      subCategoryAddedSuccess: req.session.subCategoryAddedSuccess,
      subCategoryDeletedSuccess: req.session.subCategoryDeletedSuccess,
      subCategoryRestoredSuccess: req.session.subCategoryRestoredSuccess,
      subCategoryAddValidationError: req.session.subCategoryAddValidationError,
    });
    req.session.subCategoryAddedSuccess = false;
    req.session.subCategoryDeletedSuccess = false;
    req.session.subCategoryRestoredSuccess = false;
    req.session.subCategoryAddValidationError = false;
    // } else {
    //   req.session.subCategoryAddedSuccess = false;
    //   res.redirect('/admin/add-category');
    // }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Create a sub-category
const createSubCategory = asyncHandler(async (req, res, next) => {
  try {
    // console.log('form valuesesseses:----->', req.body['parent[]']);
    const createdSubCategory = await subCategoryHelpers.addSubCategory(req);
    // console.log('createdccc:', createdSubCategory);
    if (createdSubCategory) {
      req.session.subCategoryAddedSuccess = `You have successfully added sub-category ${createdSubCategory.title}`;
      res.redirect('/admin/add-sub-category');
    } else {
      req.session.subCategoryAddedSuccess = false;
      res.redirect('/admin/add-sub-category');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// GET edit category page
const getEditSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const { admin } = req.session;
    const { slug } = req.params;
    const findSingleSubCategory = await subCategoryHelpers.findSubCategory(
      slug
    );
    // rest of the parent categories present
    const findCategories = await categoryHelpers.allCategories();
    const categoryTitles = findCategories.map(({ title }) => title);
    res.render('admin/edit-sub-category', {
      isAdmin: true,
      admin,
      categories: categoryTitles,
      subCategory: findSingleSubCategory,
      //   subCategories: findAllSubCategories,
      subCategoryEditedSuccess: req.session.subCategoryEditedSuccess,
      subCategoryEditValidationError:
        req.session.subCategoryEditValidationError,
    });
    // req.session.subCategoryCurrentTitle = JSON.stringify(
    //   findSingleSubCategory.title
    // );
    // console.log('sessiontitle', req.session.subCategoryCurrentTitle);
    // console.log('findsingletitle', findSingleSubCategory.title);
    req.session.subCategoryEditedSuccess = false;
    req.session.subCategoryEditValidationError = false;
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// POST edit category page
const postEditSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const editedSubCategory = await subCategoryHelpers.updateSubCategory(
      slug,
      req
    );

    if (editedSubCategory) {
      req.session.subCategoryEditedSuccess =
        'You have successfully edited the sub-category.';
      res.redirect(`/admin/edit-sub-category/${slug}`);
    } else {
      req.session.subCategoryEditedSuccess = false;
      res.redirect(`/admin/edit-sub-category/${slug}`);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Delete a category
const getDeleteSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedSubCategory = await subCategoryHelpers.deleteSubCategory(slug);
    if (deletedSubCategory) {
      req.session.subCategoryDeletedSuccess = `You have successfully deleted sub-category ${deletedSubCategory.title}`;
      res.redirect('/admin/add-sub-category');
    } else {
      req.session.subCategoryDeletedSuccess = false;
      res.redirect('/admin/add-sub-category');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// Restore a category
const getRestoreSubCategory = asyncHandler(async (req, res, next) => {
  try {
    const { slug } = req.params;
    const restoredSubCategory = await subCategoryHelpers.restoreSubCategory(
      slug
    );
    if (restoredSubCategory) {
      req.session.subCategoryRestoredSuccess = `You have successfully restored sub-category ${restoredSubCategory.title}`;
      res.redirect('/admin/add-sub-category');
    } else {
      req.session.subCategoryRestoredSuccess = false;
      res.redirect('/admin/add-sub-category');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = {
  getAllSubCategories,
  createSubCategory,
  getEditSubCategory,
  postEditSubCategory,
  getDeleteSubCategory,
  getRestoreSubCategory,
};
