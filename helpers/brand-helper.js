const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Brand = require('../models/brand-model');
const Product = require('../models/product-model');
// const { Brand } = require('../models/brand-model');

// GET all the Brands
const allBrands = asyncHandler(async () => {
  try {
    const getBrands = await Brand.find();
    const foundBrands = JSON.parse(JSON.stringify(getBrands));
    if (foundBrands) {
      return foundBrands;
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Create the brand
const addBrand = asyncHandler(async (data) => {
  try {
    const brandTitle = data.body.title;
    const brandSlug = slugify(brandTitle, {
      lower: true,
      replacement: '-',
    });
    // check if slug is not already taken
    // const checkSlug = await Brand.findOne({ slug: brandSlug });
    // if (checkSlug) {
    //   brandSlug += `-${Math.floor(Math.random() * 1000)}`;
    // }
    // if (checkSlug) {

    //   return false;
    // }

    const brandData = {
      ...data.body,
      slug: brandSlug,
    };

    const newBrand = await Brand.create(brandData);
    if (newBrand) {
      return newBrand;
    }
    // const newBrand = await Brand({
    //   title: brandData.title,
    //   slug: brandData.slug,
    //   description: brandData.description,
    // });
    // if (newBrand.save()) {
    //   return newBrand;
    // }
  } catch (error) {
    throw new Error(error);
  }
});

// Find a brand
const findBrand = asyncHandler(async (slug) => {
  try {
    const getBrand = await Brand.findOne({ slug });
    const foundBrand = JSON.parse(JSON.stringify(getBrand));
    return foundBrand;
  } catch (error) {
    throw new Error(error);
  }
});

// Find a brand by title
const findBrandByTitle = asyncHandler(async (title) => {
  try {
    const getBrand = await Brand.findOne({ title });
    const foundBrand = JSON.parse(JSON.stringify(getBrand));
    return foundBrand;
  } catch (error) {
    throw new Error(error);
  }
});

// update a brand
const updateBrand = asyncHandler(async (slug, data) => {
  try {
    const updated = await Brand.updateOne(
      { slug },
      {
        $set: {
          title: data.body.title,
          description: data.body.description,
        },
      }
    );
    // console.log('updatedP:->', updated);
    return updated;
  } catch (error) {
    throw new Error(error);
  }
});

// soft delete all products in a brand
const deleteBrandProducts = asyncHandler(async (brandSlug) => {
  try {
    const markedProducts = await Product.updateMany(
      { brandSlug },
      { isDeleted: true },
      { new: true }
    );
    if (markedProducts) {
      return markedProducts;
    }
  } catch (error) {
    throw new Error();
  }
});

// delete a brand
const deleteBrand = asyncHandler(async (slug) => {
  try {
    const delBrand = await Brand.findOneAndUpdate(
      { slug },
      { isDeleted: true },
      { new: true }
    );
    const deletedBrand = await deleteBrandProducts(slug);
    if (delBrand || deletedBrand) return delBrand;
  } catch (error) {
    throw new Error(error);
  }
});

// restore products of a brand
const restoreBrandProducts = asyncHandler(async (brandSlug) => {
  try {
    const markedProduct = await Product.updateMany(
      { brandSlug },
      { isDeleted: false },
      { new: true }
    );
    if (markedProduct) {
      return markedProduct;
    }
  } catch (error) {
    throw new Error();
  }
});
// restore a brand
const restoreBrand = asyncHandler(async (slug) => {
  try {
    const resBrand = await Brand.findOneAndUpdate(
      { slug },
      { isDeleted: false },
      { new: true }
    );

    const restoredProducts = await restoreBrandProducts(slug);
    if (restoredProducts || resBrand) return resBrand;
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  allBrands,
  addBrand,
  findBrand,
  updateBrand,
  deleteBrand,
  restoreBrand,
  findBrandByTitle,
};
