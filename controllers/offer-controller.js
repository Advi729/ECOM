const asyncHandler = require('express-async-handler');
const categoryHelpers = require('../helpers/category-helper');
const productHelpers = require('../helpers/product-helper');
const offerHelpers = require('../helpers/offer-helper');

// get add offer page for category
const getAddCategoryOffer = asyncHandler(async (req, res) => {
  try {
    const { admin } = req.session;
    const findAllCategories = await categoryHelpers.allCategories();
    const findOffers = await offerHelpers.allOffers();
    res.render('admin/add-category-offer', {
      admin,
      isAdmin: true,
      categories: findAllCategories,
      offers: findOffers,
    });
  } catch (error) {
    throw new Error(error);
  }
});

// post add offer for category
const postAddCategoryOffer = asyncHandler(async (req, res) => {
  try {
    const added = await offerHelpers.addOffer(req.body);
    const { category, subCategory } = req.body;
    const updated = await productHelpers.updateDiscountPrice(
      category,
      subCategory
    );
    if (updated && added) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Change offer status
const changeOfferStatus = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await offerHelpers.getSingleOffer(id);
    const changed = await offerHelpers.changeStatus(id);
    const updatedPrice = await productHelpers.updateDiscountPrice(
      offer.category,
      offer.subCategory
    );
    if (changed && updatedPrice) res.json({ status: true });
  } catch (error) {
    throw new Error(error);
  }
});

// Delete offer
const deleteOffer = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const offer = await offerHelpers.getSingleOffer(id);
    const deleted = await offerHelpers.deleteTheOffer(id);
    const updatedPrice = await productHelpers.updateDiscountPrice(
      offer.category,
      offer.subCategory
    );
    if (deleted) res.redirect('/admin/add-category-offer');
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  getAddCategoryOffer,
  postAddCategoryOffer,
  changeOfferStatus,
  deleteOffer,
};
