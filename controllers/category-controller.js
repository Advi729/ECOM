const asyncHandler = require('express-async-handler');
const Category = require('../models/category-model');

// Create a category
const createCategory = asyncHandler(async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    console.log(newCategory);
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const editCategory = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(editCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const delCategory = await Category.findByIdAndDelete(id);
    res.json(delCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Get a category
const getaCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getCategory = await Category.findById(id);
    res.json(getCategory);
  } catch (error) {
    throw new Error(error);
  }
});

// Get All categories
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const getCategories = await Category.find();
    res.json(getCategories);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getaCategory,
  getAllCategories,
};
