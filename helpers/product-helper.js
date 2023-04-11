const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/product-model');
const categoryHelpers = require('./category-helper');
const subCategoryHelpers = require('./sub-category-helper');
const brandHelpers = require('./brand-helper');

// Find all products
const findProducts = async () => {
  try {
    const productDetails = await Product.find();
    const foundProducts = JSON.parse(JSON.stringify(productDetails));
    // console.log('foundProufufuf:->', foundProducts);

    // res.json(productDetails);
    return foundProducts;
  } catch (error) {
    throw new Error();
  }
};

// Find a single product using slug
const findSingleProduct = async (slug) => {
  try {
    const singleProduct = await Product.findOne({ slug });
    const foundProduct = JSON.parse(JSON.stringify(singleProduct));
    return foundProduct;
  } catch (error) {
    throw new Error(error);
  }
};

// Find a single product using Id
const findSingleProductId = async (prodId) => {
  try {
    const singleProduct = await Product.findOne({ _id:prodId });
    const foundProduct = JSON.parse(JSON.stringify(singleProduct));
    return foundProduct;
  } catch (error) {
    throw new Error(error);
  }
};

// Create a product
const createProduct = asyncHandler(async (data) => {
  try {
    const imagesFromReq = data.files.images;
    let imageFiles;
    const imageNames = [];
    imagesFromReq.forEach((element) => {
      [imageFiles] = [element];
      imageNames.push(imageFiles.filename);
    });

    const productTitle = data.body.title;
    let productSlug = slugify(productTitle, { lower: true, replacement: '-' });
    // check if slug is not already taken
    const checkSlug = await Product.findOne({ slug: productSlug });
    if (checkSlug) {
      productSlug += `-${Math.floor(Math.random() * 1000)}`;
    }

    const categoryDetails = await categoryHelpers.findCategoryByTitle(
      data.body.category
    );
    const categorySlug = categoryDetails.slug;
    const footwear = 'footwear';
    const separator = 's-';
    const combinedCategorySlug = `${categorySlug}${separator}${footwear}`;
    const finalCategorySlug = slugify(combinedCategorySlug, { lower: true });

    const subCategoryDetails = await subCategoryHelpers.findSubCategoryByTitle(
      data.body.subCategory
    );
    // creating new slug for sub-category
    const subCategorySlug = subCategoryDetails.slug;
    const combinedSlug = `${categorySlug}${separator}${subCategorySlug}`;
    const finalSubCategorySlug = slugify(combinedSlug, { lower: true });

    // brand slug
    const brandDetails = await brandHelpers.findBrandByTitle(data.body.brand);
    const brandSlug = brandDetails.slug;

    const productData = {
      ...data.body,
      images: imageNames,
      slug: productSlug,
      categorySlug: finalCategorySlug,
      subCategorySlug: finalSubCategorySlug,
      brandSlug,
    };
    const addedProduct = await Product.create(productData);
    return addedProduct;
  } catch (error) {
    throw new Error(error);
  }
});

const updateProduct = asyncHandler(async (slug, data) => {
  try {
    // const updated = await Product.findOneAndUpdate(slug, data, {
    //   new: true,
    // });
    let updated;
    if (data.files.images) {
      const imagesFromReq = data.files.images;
      let imageFiles;
      const imageNames = [];
      imagesFromReq.forEach((element) => {
        [imageFiles] = [element];
        imageNames.push(imageFiles.filename);
      });

      updated = await Product.updateOne(
        { slug },
        {
          $set: {
            title: data.body.title,
            description: data.body.description,
            price: data.body.price,
            category: data.body.category,
            subCategory: data.body.subCategory,
            brand: data.body.brand,
            quantity: data.body.quantity,
            images: imageNames,
            color: data.body.color,
          },
        }
      );
    } else {
      updated = await Product.updateOne(
        { slug },
        {
          $set: {
            title: data.body.title,
            description: data.body.description,
            price: data.body.price,
            category: data.body.category,
            subCategory: data.body.subCategory,
            brand: data.body.brand,
            quantity: data.body.quantity,
            color: data.body.color,
          },
        }
      );
    }

    // console.log('updatedP:->', updated);
    return updated;
  } catch (error) {
    throw new Error();
  }
});

const markDelete = asyncHandler(async (slug) => {
  try {
    const markedProduct = await Product.findOneAndUpdate(
      { slug },
      { isDeleted: true },
      { new: true }
    );
    if (markedProduct) {
      return markedProduct;
    }
  } catch (error) {
    throw new Error();
  }
});

const unMarkDelete = asyncHandler(async (slug) => {
  try {
    const markedProduct = await Product.findOneAndUpdate(
      { slug },
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

const markPermanentDeleted = asyncHandler(async (slug) => {
  try {
    const markedProduct = await Product.findOneAndUpdate(
      { slug },
      { isDeleted: true, isPermanentDeleted: true },
      { new: true }
    );
    if (markedProduct) {
      return markedProduct;
    }
  } catch (error) {
    throw new Error();
  }
});

// Find all products by category-slug
const findProductsByCategorySlug = async (categorySlug) => {
  try {
    const productDetails = await Product.find({ categorySlug });
    const foundProducts = JSON.parse(JSON.stringify(productDetails));
    // console.log('foundProufufuf:->', foundProducts);

    // res.json(productDetails);
    return foundProducts;
  } catch (error) {
    throw new Error();
  }
};

// Find all products by sub-category-slug
const findProductsBySubCategorySlug = async (subCategorySlug) => {
  try {
    const productDetails = await Product.find({ subCategorySlug });
    const foundProducts = JSON.parse(JSON.stringify(productDetails));
    // console.log('foundProufufuf:->', foundProducts);

    // res.json(productDetails);
    return foundProducts;
  } catch (error) {
    throw new Error();
  }
};

// Find all products by brand-slug
const findProductsByBrandSlug = async (brandSlug) => {
  try {
    const productDetails = await Product.find({ brandSlug });
    const foundProducts = JSON.parse(JSON.stringify(productDetails));
    // console.log('foundProufufuf:->', foundProducts);

    // res.json(productDetails);
    return foundProducts;
  } catch (error) {
    throw new Error();
  }
};

module.exports = {
  findProducts,
  findSingleProduct,
  findSingleProductId,
  createProduct,
  updateProduct,
  markDelete,
  unMarkDelete,
  markPermanentDeleted,
  findProductsByCategorySlug,
  findProductsBySubCategorySlug,
  findProductsByBrandSlug,
};
