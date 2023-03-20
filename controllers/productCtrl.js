const Product = require('../models/productModel');
const User = require('../models/userModel');

const asyncHandler = require('express-async-handler');
  

// Create product 
const createProduct = asyncHandler(async (req, res) => {
    console.log(req.body);
    console.log(req.files);
    console.log('req.files.images:::--',req.files.images);
    // const {filename} = req.files;

    try { 
        // Extract filenames from images array
        // const filenames = req.files.images.map(image => image.filename);
        const [ img1, img2 ]  = req.files.images;
        // const filenames = images.map(({ filename }) => filename);

        // const productData = { ...req.body, images: filenames };
        const productData = { ...req.body, images: [img1.filename,img2.filename] };

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
})

// Get a product
const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})
 
// get all products admin side
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const findAllProducts = await Product.find();

        // res.json({findAllProducts});
        // res.render('index',{findAllProducts});
        console.log('0000000000000000000000000000000000000000000000000000000000000000');
        // console.log(findAllProducts);

        const products = [];
        for(let i = 0; i < findAllProducts.length; i++) {
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
        res.render('admin/view-products',{allProducts: products, admin: true});
    } catch (error) {
        throw new Error(error); 
    }
});

// get all products user side
const getAllProductsUser = asyncHandler(async (req, res) => {
    try {
        const findAllProducts = await Product.find();

        // res.json({findAllProducts});
        // res.render('index',{findAllProducts});

        const products = [];
        for(let i = 0; i < findAllProducts.length; i++) {
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
        res.render('user/home',{allProducts: products, user: true});
    } catch (error) {
        throw new Error(error); 
    }
});


// Update a product
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateProd = await Product.findOneAndUpdate(
            id,
            req.body,
            {new:true}
        );
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
    uploadImages
 };