const asyncHandler = require('express-async-handler');
const slugify = require('slugify');
const Product = require('../models/product-model');

// Create product
const createProduct = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  console.log('req.files.images:::--', req.files.images);
  // const {filename} = req.files;

  try {
    // Extract filenames from images array
    // const filenames = req.files.images.map(image => image.filename);
    // const [img1, img2] = req.files.images;
    // const filenames = images.map(({ filename }) => filename);

    // const productData = { ...req.body, images: filenames };

    const imagesFromReq = req.files.images;
    let imageFiles;
    const imageNames = [];
    imagesFromReq.forEach((element) => {
      [imageFiles] = [element];
      imageNames.push(imageFiles.filename);
    });

    const productTitle = req.body.title;
    let productSlug = slugify(productTitle, { lower: true });
    // check if slug is not already taken
    const checkSlug = await Product.findOne({ slug: productSlug });
    if (checkSlug) {
      productSlug += `-${Math.floor(Math.random() * 1000)}`;
    }

    const productData = { ...req.body, images: imageNames, slug: productSlug };

    const newProduct = await Product.create(productData);

    // const newProduct = await Product.create(req.body);

    // res.json(newProduct);
    // here we have to give successfully added message
    // console.log('vor:',req.body);

    // res.render('admin/view-products',{newProduct,admin:true});  //working except display

    res.redirect('/admin/products-list');
  } catch (error) {
    throw new Error(error);
  }
});

const uploadImages = asyncHandler(async (req, res) => {
  console.log(req.files);
});

// Get a product
const getProduct = asyncHandler(async (req, res, next) => {
  const { slug } = req.params;
  console.log(slug);
  try {
    const findProduct = await Product.findOne({ slug });
    console.log('controller:', findProduct);
    const foundProduct = JSON.parse(JSON.stringify(findProduct));
    // res.json(findProduct);
    req.oneProduct = foundProduct;
    next();
  } catch (error) {
    throw new Error(error);
  }
});

// get all products admin side
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const findAllProducts = await Product.find();

    // res.json({findAllProducts});
    // res.render('index',{findAllProducts});
    // console.log('0000000000000000000000000000000000000000000000000000000000000000');
    // console.log(findAllProducts);

    const products = [];
    for (let i = 0; i < findAllProducts.length; i++) {
      // console.log(findAllProducts[i].images);
      const product = {
        title: findAllProducts[i].title,
        slug: findAllProducts[i].slug,
        description: findAllProducts[i].description,
        price: findAllProducts[i].price,
        category: findAllProducts[i].category,
        brand: findAllProducts[i].brand,
        quantity: findAllProducts[i].quantity,
        sold: findAllProducts[i].sold,
        images: findAllProducts[i].images[0],
        color: findAllProducts[i].color,
      };
      products.push(product);
    }
    res.render('admin/view-products', { allProducts: products, admin: true });
  } catch (error) {
    throw new Error(error);
  }
});

// get all products user side
const getAllProductsUser = asyncHandler(async (req, res, next) => {
  try {
    const findAllProducts = await Product.find();

    // res.json({findAllProducts});
    // res.render('index',{findAllProducts});

    const products = [];
    for (let i = 0; i < findAllProducts.length; i++) {
      // console.log(findAllProducts[i].images);
      const product = {
        title: findAllProducts[i].title,
        slug: findAllProducts[i].slug,
        description: findAllProducts[i].description,
        price: findAllProducts[i].price,
        category: findAllProducts[i].category,
        brand: findAllProducts[i].brand,
        quantity: findAllProducts[i].quantity,
        sold: findAllProducts[i].sold,
        images: findAllProducts[i].images[0],
        color: findAllProducts[i].color,
      };
      products.push(product);
    }

    req.productsAll = products;
    // console.log(req.productsAll);
    next();
    // res.render('user/home',{allProducts: products, user: true});
  } catch (error) {
    throw new Error(error);
  }
});

// Update a product
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updateProd = await Product.findOneAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updateProd);
  } catch (error) {
    throw new Error(error);
  }
});

// Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProd = await Product.findByIdAndDelete(id);
    res.json(deleteProd);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createProduct,
  getProduct,
  getAllProducts,
  getAllProductsUser,
  updateProduct,
  deleteProduct,
  uploadImages,
};
