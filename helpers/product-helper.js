const asyncHandler = require('express-async-handler');
const Product = require('../models/product-model');

module.exports = {
  allProducts: () => {
    asyncHandler(async (req, res) => {
      try {
        const findAllProducts = await Product.find();
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
        console.log('products:', products);
        return products;
      } catch (error) {
        throw new Error(error);
      }
    });
  },
  // {
  //     return new Promise(async (resolve, reject) => {
  //         await products.find().then((products) => {
  //             resolve(products);
  //         })
  //     })
  //         .catch((err) => {
  //             console.log(err);
  //         })
  // }
};
