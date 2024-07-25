const express = require('express')
const { getShop, getShopById, placeOrder, getAllUserOrders, getShopCategories, addProduct, deleteProductById } = require('../Controllers/ShopController')
const router = express.Router()

const multer = require('multer');
const adminAuthenticateToken = require('../Middlewares/AdminAuthMiddleware');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/shop') // Uploads folder where files will be stored
    },
    filename: function (req, file, cb) {
        // Use original file name with a timestamp to avoid overwriting files with the same name
        cb(null, Date.now() + '-' + file.originalname)
    }
});
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: storage })
const multipleUpload = upload.fields([{ name: "image", maxCount: 1 }])
router.route("/getshop").get(getShop)
router.route("/getshopcategories").get(getShopCategories)
router.route("/getshopbyid/:id").get(getShopById)
router.route("/placeorder")
    .post(placeOrder)

router.route("/getuserorders/:userId")
    .get(getAllUserOrders)

router.route("/addproduct")
    .post(adminAuthenticateToken, multipleUpload, addProduct)
router.route("/deleteproduct/:id").delete(adminAuthenticateToken, multipleUpload, deleteProductById)
module.exports = router