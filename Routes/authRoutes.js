const express=require("express");
const { adminLogin, creatorLogin, creatorSignup } = require("../Controllers/AuthController");
const router=express.Router();


router.route("/adminlogin")
    .post(adminLogin);

router.route("/cretorlogin")
    .post(creatorLogin)
router.route("/cretorsignup")
    .post(creatorSignup)
module.exports=router;