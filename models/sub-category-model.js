const mongoose = require('mongoose');

// Declare the Sub-category schema of the Mongo model
const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  parent: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('SubCategory', subCategorySchema);
