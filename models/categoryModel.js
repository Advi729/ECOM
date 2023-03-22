const mongoose = require('mongoose');

// Declare the Category Schema of the Mongo model
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

// Export the model
module.exports = mongoose.model('Category', categorySchema);
