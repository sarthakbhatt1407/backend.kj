const express = require('express');
const { getPathshala, getPathshalaById, addPathshala, deletePahtshalaById } = require('../Controllers/pathshalaController');
const multer = require('multer');
const adminAuthenticateToken = require('../Middlewares/AdminAuthMiddleware');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/pathshala') // Uploads folder where files will be stored
    },
    filename: function (req, file, cb) {
        // Use original file name with a timestamp to avoid overwriting files with the same name
        cb(null, Date.now() + '-' + file.originalname)
    }
});
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: storage })
const multipleUpload = upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "mediaFile", maxCount: 1 }])

const router = express.Router();

router.route("/getallpathshala").get(getPathshala);
router.route("/getpathshalabyid/:id").get(getPathshalaById);
router.route("/addpathshala")
    .post(adminAuthenticateToken, multipleUpload, addPathshala)
router.route("/deletepathshala/:id").delete(adminAuthenticateToken, multipleUpload, deletePahtshalaById)
module.exports = router;
