const express = require("express");
const User = require("../models/userModel");
const { getAllProducts, getProduct } = require("../controllers/productCtrl");
const { 
    getAllUsers, 
    getaUser, 
    deleteaUser, 
    blockUser, 
    unblockUser, 
    handleRefreshToken, 
    logoutUser, 
    loginAdminGet, 
    loginAdminPost,
    loginUserGet,
    loginUserPost,
    createUserGet,
    createUserPost,
} = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();
 
// router.get("/", (req,res)=>{    
//     console.log("req.body");   
//     res.render("user/user-index");  
// router.get('/:id', getProduct);
// router.get('/', getAllProducts);
// });  
router.get('/', async (req, res) => {
    let allProducts = getAllProducts();
    // const allProducts = 100;
    console.log(req.body);
    if(req.body !== ' '){     
        const { email } = req.body;
        const adUser = await User.findOne({email});
        if(adUser.role == "admin") {
            res.render('admin/dashboard',{adUser,admin:true});
        } else {
            res.render('user/home',{adUser,allProducts,user:true});
        }
    } else {
        res.render('user/home',{allProducts,user:true});
    }
    

});   
// router.get('/:id', getProduct); // edit  

router.route("/signup")
.get(createUserGet)  
.post(createUserPost); 
// router.post("/signup", createUser);

router.route("/login")
.get(loginUserGet)  
.post(loginUserPost);  
// router.post("/login", loginUser); 

router.route("/admin-login")
.get(loginAdminGet)  
.post(loginAdminPost);   

router.get("/all-users", getAllUsers); 
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logoutUser); 

router.get("/:id", authMiddleware, isAdmin, getaUser); 
router.delete("/:id", deleteaUser); 
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser); 
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser); 



module.exports = router;

