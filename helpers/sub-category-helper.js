const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
// const SubCategory = require('../models/category-model');
const { SubCategory } = require('../models/sub-category-model');
const Product = require('../models/product-model');
const { Category } = require('../models/category-model');

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

// Add subCategory to the CategorySchema
const updateInCategorySchemaAdd = asyncHandler(
  async (parentCategory, subCategoryTitle) => {
    try {
      const updated = await Category.updateMany(
        { title: { $in: parentCategory } },
        { $addToSet: { subCategory: subCategoryTitle } }
      );
      if (updated) return updated;
    } catch (error) {
      throw new Error(error);
    }
  }
);

// Create the sub-category POST method
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
    const updateCategory = await updateInCategorySchemaAdd(
      parentArr,
      subCategoryTitle
    );
    if (newSubCategory && updateCategory) {
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

// Edit subCategory to the CategorySchema
const updateInCategorySchemaDelete = asyncHandler(
  async (parentCategory, subCategoryTitle) => {
    try {
      const updated = await Category.updateMany(
        { title: { $nin: parentCategory } },
        { $pull: { subCategory: subCategoryTitle } }
      );
      if (updated) return updated;
    } catch (error) {
      throw new Error(error);
    }
  }
);

// update a category
const updateSubCategory = asyncHandler(async (slug, data) => {
  try {
    const subCategoryTitle = data.body.title;
    const subCategorySlug = slugify(subCategoryTitle, {
      lower: true,
      replacement: '-',
    });

    const parentArray = data.body['parent[]'];
    const updated = await SubCategory.updateOne(
      { slug },
      {
        $set: {
          title: data.body.title,
          description: data.body.description,
          parent: parentArray,
          slug: subCategorySlug,
        },
      }
    );
    const updateCategory = await updateInCategorySchemaAdd(
      parentArray,
      subCategoryTitle
    );
    // const subCategoryTitles = [];
    // subCategoryTitles.push(subCategoryTitle);
    if (updated && updateCategory) {
      // subCategoryTitles.push(data.session.subCategoryCurrentTitle);
      await updateInCategorySchemaDelete(parentArray, subCategoryTitle);
    }
    return updated;
  } catch (error) {
    throw new Error(error);
  }
});

// soft delete all products in a sub-category
const deleteSubCategoryProducts = asyncHandler(async (subCategorySlugs) => {
  try {
    const markedProducts = await Product.updateMany(
      { subCategorySlug: { $in: subCategorySlugs } }, // $in operator to match any of the subCategorySlugs
      { isDeleted: true }
    );
    if (markedProducts) {
      return markedProducts;
    }
  } catch (error) {
    throw new Error(error);
  }
});

// delete a sub category
const deleteSubCategory = asyncHandler(async (slug) => {
  try {
    const delSubCategory = await SubCategory.findOneAndUpdate(
      { slug },
      { isDeleted: true },
      { new: true }
    );

    const subCategory = await findSubCategory(slug);
    const { parent: category } = subCategory;
    const separator = 's-';
    const categorySlugs = category.map((e) => `${e}${separator}${slug}`);
    const finalSlugs = categorySlugs.map((e) => slugify(e, { lower: true }));
    // console.log('finalslugssss:-> delete subcat', finalSlugs);

    const delProducts = await deleteSubCategoryProducts(finalSlugs);

    if (delProducts || delSubCategory) return delSubCategory;
    // return delSubCategory;
  } catch (error) {
    throw new Error(error);
  }
});

// restore products of sub-category
const restoreSubCategoryProducts = asyncHandler(async (subCategorySlugs) => {
  try {
    const restoredProducts = Product.updateMany(
      { subCategorySlug: { $in: subCategorySlugs } },
      { isDeleted: false }
    );
    if (restoredProducts) return restoredProducts;
  } catch (error) {
    throw new Error(error);
  }
});

// restore a sub-category
const restoreSubCategory = asyncHandler(async (slug) => {
  try {
    const resSubCategory = await SubCategory.findOneAndUpdate(
      { slug },
      { isDeleted: false },
      { new: true }
    );

    const subCategory = await findSubCategory(slug);
    const { parent: category } = subCategory;
    const separator = 's-';
    const categorySlugs = category.map((e) => `${e}${separator}${slug}`);
    const finalSlugs = categorySlugs.map((e) => slugify(e, { lower: true }));

    const restoredProds = await restoreSubCategoryProducts(finalSlugs);
    if (restoredProds || resSubCategory) return resSubCategory;
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
