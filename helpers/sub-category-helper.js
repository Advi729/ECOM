const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
// const SubCategory = require('../models/category-model');
const { SubCategory } = require('../models/sub-category-model');

// GET all the sub-categories
const allSubCategories = asyncHandler(async () => {
  try {
    const getSubCategories = await SubCategory.find();
    const foundSubCategories = JSON.parse(JSON.stringify(getSubCategories));
    if (foundSubCategories) {
      return foundSubCategories;
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Create the category POST method
const addSubCategory = asyncHandler(async (data) => {
  try {
    const subCategoryTitle = data.body.title;
    const subCategorySlug = slugify(subCategoryTitle, {
      lower: true,
      replacement: '-',
    });

    // 'parent[]': [ 'Women', 'Kid' ],
    const parentArr = data.body['parent[]'];
    const subCategoryData = {
      ...data.body,
      parent: parentArr,
      slug: subCategorySlug,
    };

    const newSubCategory = await SubCategory.create(subCategoryData);
    if (newSubCategory) {
      return newSubCategory;
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Find a sub-category
const findSubCategory = asyncHandler(async (slug) => {
  try {
    const getSubCategory = await SubCategory.findOne({ slug });
    const foundSubCategory = JSON.parse(JSON.stringify(getSubCategory));
    return foundSubCategory;
  } catch (error) {
    throw new Error(error);
  }
});

// Find a sub-category by title
const findSubCategoryByTitle = asyncHandler(async (title) => {
  try {
    const getSubCategory = await SubCategory.findOne({ title });
    const foundSubCategory = JSON.parse(JSON.stringify(getSubCategory));
    return foundSubCategory;
  } catch (error) {
    throw new Error(error);
  }
});

// update a category
const updateSubCategory = asyncHandler(async (slug, data) => {
  try {
    const parentArray = data.body['parent[]'];
    const updated = await SubCategory.updateOne(
      { slug },
      {
        $set: {
          title: data.body.title,
          description: data.body.description,
          parent: parentArray,
        },
      }
    );
    // console.log('updatedP:->', updated);
    return updated;
  } catch (error) {
    throw new Error(error);
  }
});

// delete a category
const deleteSubCategory = asyncHandler(async (slug) => {
  try {
    const delSubCategory = await SubCategory.findOneAndUpdate(
      { slug },
      { isDeleted: true },
      { new: true }
    );
    return delSubCategory;
  } catch (error) {
    throw new Error(error);
  }
});

// restore a category
const restoreSubCategory = asyncHandler(async (slug) => {
  try {
    const resSubCategory = await SubCategory.findOneAndUpdate(
      { slug },
      { isDeleted: false },
      { new: true }
    );
    return resSubCategory;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  allSubCategories,
  addSubCategory,
  findSubCategory,
  updateSubCategory,
  deleteSubCategory,
  restoreSubCategory,
  findSubCategoryByTitle,
};
