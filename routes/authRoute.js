const express = require("express");
const { createUser,loginUser, getAllUsers, getaUser, deleteaUser, blockUser, unblockUser, handleRefreshToken, logoutUser } = require("../controllers/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/signup",createUser);
router.post("/login",loginUser);   
router.get("/all-users",getAllUsers); 
router.get("/refresh", handleRefreshToken); 
router.get("/logout", logoutUser); 

router.get("/:id", authMiddleware, isAdmin, getaUser); 
router.delete("/:id",deleteaUser); 
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser); 
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser); 



module.exports = router;

