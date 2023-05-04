const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    heading: {
      type: String,
      required: true,
    },
    subHeading: {
      type: String,
      required: true,
    },
    footer: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Banner', bannerSchema);
