const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
// const Category = require('../models/category-model');
const { Category } = require('../models/category-model');

// GET all the categories
const allCategories = asyncHandler(async () => {
  try {
    const getCategories = await Category.find();
    const foundCategories = JSON.parse(JSON.stringify(getCategories));
    if (foundCategories) {
      return foundCategories;
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Create the category
const addCategory = asyncHandler(async (data) => {
  try {
    const categoryTitle = data.body.title;
    const categorySlug = slugify(categoryTitle, {
      lower: true,
      replacement: '-',
    });
    // check if slug is not already taken
    // const checkSlug = await Category.findOne({ slug: categorySlug });
    // if (checkSlug) {
    //   categorySlug += `-${Math.floor(Math.random() * 1000)}`;
    // }
    // if (checkSlug) {

    //   return false;
    // }
    const subCategoryArray = data.body['subCategory[]'];

    const categoryData = {
      ...data.body,
      subCategory: subCategoryArray,
      slug: categorySlug,
    };

    const newCategory = await Category.create(categoryData);
    if (newCategory) {
      return newCategory;
    }
    // const newCategory = await Category({
    //   title: categoryData.title,
    //   slug: categoryData.slug,
    //   description: categoryData.description,
    // });
    // if (newCategory.save()) {
    //   return newCategory;
    // }
  } catch (error) {
    throw new Error(error);
  }
});

// Find a category
const findCategory = asyncHandler(async (slug) => {
  try {
    const getCategory = await Category.findOne({ slug });
    const foundCategory = JSON.parse(JSON.stringify(getCategory));
    return foundCategory;
  } catch (error) {
    throw new Error(error);
  }
});

// Find a category by title
const findCategoryByTitle = asyncHandler(async (title) => {
  try {
    const getCategory = await Category.findOne({ title });
    const foundCategory = JSON.parse(JSON.stringify(getCategory));
    return foundCategory;
  } catch (error) {
    throw new Error(error);
  }
});

// update a category
const updateCategory = asyncHandler(async (slug, data) => {
  try {
    const subCategoryArray = data.body['subCategory[]'];

    const updated = await Category.updateOne(
      { slug },
      {
        $set: {
          title: data.body.title,
          description: data.body.description,
          subCategory: subCategoryArray,
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
const deleteCategory = asyncHandler(async (slug) => {
  try {
    const delCategory = await Category.findOneAndUpdate(
      { slug },
      { isDeleted: true },
      { new: true }
    );
    return delCategory;
  } catch (error) {
    throw new Error(error);
  }
});

// restore a category
const restoreCategory = asyncHandler(async (slug) => {
  try {
    const resCategory = await Category.findOneAndUpdate(
      { slug },
      { isDeleted: false },
      { new: true }
    );
    return resCategory;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  allCategories,
  addCategory,
  findCategory,
  updateCategory,
  deleteCategory,
  restoreCategory,
  findCategoryByTitle,
};
