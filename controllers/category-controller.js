const asyncHandler = require('express-async-handler');
const categoryHelpers = require('../helpers/category-helper');
const subCategoryHelpers = require('../helpers/sub-category-helper');
const Category = require('../models/category-model');

// Get All categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const findAllCategories = await categoryHelpers.allCategories();
    const findAllSubCategories = await subCategoryHelpers.allSubCategories();
    // console.log(findAllCategories);
    // if (findAllCategories) {
    res.render('admin/add-category', {
      isAdmin: true,
      admin,
      categories: findAllCategories,
      subCategories: findAllSubCategories,
      categoryAddedSuccess: req.session.categoryAddedSuccess,
      categoryDeletedSuccess: req.session.categoryDeletedSuccess,
      categoryRestoredSuccess: req.session.categoryRestoredSuccess,
      categoryAddValidationError: req.session.categoryAddValidationError,
    });
    req.session.categoryAddedSuccess = false;
    req.session.categoryDeletedSuccess = false;
    req.session.categoryRestoredSuccess = false;
    req.session.categoryAddValidationError = false;
    // } else {
    //   req.session.categoryAddedSuccess = false;
    //   res.redirect('/admin/add-category');
    // }
  } catch (error) {
    throw new Error(error);
  }
});

// Create a category POST method
const createCategory = asyncHandler(async (req, res) => {
  try {
    console.log(req.body);
    const createdCategory = await categoryHelpers.addCategory(req);
    console.log('createdccc:', createdCategory);
    if (createdCategory) {
      req.session.categoryAddedSuccess = `You have successfully added category ${createdCategory.title}`;
      res.redirect('/admin/add-category');
    } else {
      req.session.categoryAddedSuccess = false;
      res.redirect('/admin/add-category');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// GET edit category page
const getEditCategory = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const { slug } = req.params;
    const findSingleCategory = await categoryHelpers.findCategory(slug);
    const findAllSubCategories = await subCategoryHelpers.allSubCategories();
    // console.log(findAllCategories);
    // if (findAllCategories) {
    res.render('admin/edit-category', {
      isAdmin: true,
      admin,
      category: findSingleCategory,
      subCategories: findAllSubCategories,
      categoryEditedSuccess: req.session.categoryEditedSuccess,
      categoryEditValidationError: req.session.categoryEditValidationError,
    });
    req.session.categoryEditedSuccess = false;
    req.session.categoryEditValidationError = false;
    // } else {
    //   req.session.categoryAddedSuccess = false;
    //   res.redirect('/admin/add-category');
    // }
  } catch (error) {
    throw new Error(error);
  }
});

// POST edit category page
const postEditCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const editedCategory = await categoryHelpers.updateCategory(slug, req);

    if (editedCategory) {
      req.session.categoryEditedSuccess =
        'You have successfully edited the category.';
      res.redirect(`/admin/edit-category/${slug}`);
    } else {
      res.redirect(`/admin/edit-category/${slug}`);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a category
const getDeleteCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const deletedCategory = await categoryHelpers.deleteCategory(slug);
    console.log('deleted cat:::', deletedCategory);
    if (deletedCategory) {
      req.session.categoryDeletedSuccess = `You have successfully deleted category ${deletedCategory.title}`;
      res.redirect('/admin/add-category');
    } else {
      req.session.categoryDeletedSuccess = false;
      res.redirect('/admin/add-category');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Restore a category
const getRestoreCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const restoredCategory = await categoryHelpers.restoreCategory(slug);
    if (restoredCategory) {
      req.session.categoryRestoredSuccess = `You have successfully restored category ${restoredCategory.title}`;
      res.redirect('/admin/add-category');
    } else {
      req.session.categoryRestoredSuccess = false;
      res.redirect('/admin/add-category');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Dynamically update sub-categories
const getSubCategories = asyncHandler(async (req, res) => {
  const { category } = req.body;
  console.log('bodyyy:', req.body);

  const foundCategory = await Category.findOne({ title: category });
  const finalCategory = JSON.parse(JSON.stringify(foundCategory));
  const subCategories = finalCategory.subCategory;
  console.log('subCatss:', subCategories);
  res.json({ subCategories });
});

module.exports = {
  getAllCategories,
  createCategory,
  getEditCategory,
  postEditCategory,
  getDeleteCategory,
  getRestoreCategory,
  getSubCategories,
};
