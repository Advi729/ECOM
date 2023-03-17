const express = require('express');
const { createProduct, getProduct, getAllProducts, updateProduct, deleteProduct } = require('../controllers/productCtrl');
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

             
router.route('/add-product')  
.get((req, res) => {
    res.render('admin/add-product',{admin:true});
})
.post(authMiddleware, isAdmin, createProduct);

// router.post("/dashboard", authMiddleware, isAdmin, (req, res) => {
//     res.render("admin/dashboard");
// })  // confirm its usage then use it

router.get('/products-list', getAllProducts);
router.get('/:id', getProduct);
// router.get('/products-list', getAllProducts);
router.put('/:id', authMiddleware, isAdmin, updateProduct);
router.delete('/:id', authMiddleware, isAdmin, deleteProduct);

module.exports = router;