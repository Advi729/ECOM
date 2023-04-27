const asyncHandler = require('express-async-handler');
const { json } = require('express');
const Offer = require('../models/offer-model');

// Add offer
const addOffer = asyncHandler(async (data) => {
  try {
    const { category, subCategory } = data;
    let { discountPercentage } = data;
    discountPercentage = parseFloat(discountPercentage);
    const offerExist = await Offer.findOne({ category, subCategory });
    if (offerExist) {
      const updated = await Offer.updateOne(
        { category, subCategory },
        { $set: { discountPercentage } }
      );
      return updated;
    }
    const offer = {
      category,
      subCategory,
      discountPercentage,
    };
    const newOffer = await Offer.create(offer);
    if (newOffer) return newOffer;
  } catch (error) {
    // throw new Error(error);
    console.error(error);
  }
});

// Get all offers
const allOffers = asyncHandler(async () => {
  try {
    const findOffers = await Offer.find().sort({ createdAt: -1 });
    const foundOffers = JSON.parse(JSON.stringify(findOffers));
    if (foundOffers) return foundOffers;
  } catch (error) {
    throw new Error(error);
  }
});

// Get single offer
const getSingleOffer = asyncHandler(async (id) => {
  try {
    const findOffer = await Offer.findOne({ _id: id });
    const foundOffer = JSON.parse(JSON.stringify(findOffer));
    if (foundOffer) return foundOffer;
  } catch (error) {
    throw new Error(error);
  }
});

// Change status
const changeStatus = asyncHandler(async (id) => {
  try {
    const offer = await Offer.findOne({ _id: id });

    // Toggle the active field
    offer.active = !offer.active;

    // Save the updated offer to the database
    const changed = await offer.save();

    return changed;
  } catch (error) {
    throw new Error(error);
  }
});

// Delete the offer
const deleteTheOffer = asyncHandler(async (id) => {
  try {
    const deleted = await Offer.deleteOne({ _id: id });
    if (deleted) return deleted;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  addOffer,
  allOffers,
  getSingleOffer,
  changeStatus,
  deleteTheOffer,
};
