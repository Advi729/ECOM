const asyncHandler = require('express-async-handler');
const Product = require('../models/product-model');
const productHelpers = require('../helpers/product-helper');

// create product get
const createProductGet = asyncHandler(async (req, res) => {
  res.render('admin/add-product', {
    isAdmin: true,
    productSuccess: req.session.productSuccess,
  });
  req.productSuccess = false;
});

// Create product post
const createProductPost = asyncHandler(async (req, res) => {
  // console.log(req.body);
  // console.log(req.files);
  // console.log('req.files.images:::--', req.files.images);
  // // const {filename} = req.files;

  try {
    const addedProduct = await productHelpers.createProduct(req);
    // const imagesFromReq = req.files.images;
    // let imageFiles;
    // const imageNames = [];
    // imagesFromReq.forEach((element) => {
    //   [imageFiles] = [element];
    //   imageNames.push(imageFiles.filename);
    // });

    // const productTitle = req.body.title;
    // let productSlug = slugify(productTitle, { lower: true, replacement: '_' });
    // // check if slug is not already taken
    // const checkSlug = await Product.findOne({ slug: productSlug });
    // if (checkSlug) {
    //   productSlug += `-${Math.floor(Math.random() * 1000)}`;
    // }

    // const productData = { ...req.body, images: imageNames, slug: productSlug };

    // await Product.create(productData);

    // const newProduct = await Product.create(req.body);

    // res.json(newProduct);
    // here we have to give successfully added message
    // console.log('vor:',req.body);

    // res.render('admin/view-products',{newProduct,admin:true});  //working except display
    if (addedProduct) {
      req.session.productSuccess = 'Product created successfully.';
      req.session.productStatus = true;
      res.redirect('/admin/products-list');
      // res.redirect('/admin/add-product'); // to display message
    } else {
      req.session.productSuccess = false;
      res.redirect('/admin/add-product');
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Get a product
// const getProduct = asyncHandler(async (req, res, next) => {
//   const { slug } = req.params;
//   console.log(slug);
//   try {
//     const findProduct = await Product.findOne({ slug });
//     console.log('controller:', findProduct);
//     const foundProduct = JSON.parse(JSON.stringify(findProduct));
//     // res.json(findProduct);
//     req.oneProduct = foundProduct;
//     next();
//   } catch (error) {
//     throw new Error(error);
//   }
// });

// new get a product
const getProduct = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    // console.log('slu:  ', slug);
    const productDetails = await productHelpers.findSingleProduct(slug);
    // console.log(productDetails);
    if (productDetails) {
      res.render('user/product-details', {
        product: productDetails,
        isUser: true,
      });
    }
  } catch (error) {
    throw new Error();
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
  createProductGet,
  createProductPost,
  getProduct,
  getAllProductsUser,
  updateProduct,
  deleteProduct,
};
