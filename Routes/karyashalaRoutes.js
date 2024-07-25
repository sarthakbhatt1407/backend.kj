const express = require('express');
const { getKaryashala, getKaryashalaById, addKaryashala, deleteKaryashalaById } = require('../Controllers/KaryashalaController');
const multer = require('multer');
const adminAuthenticateToken = require('../Middlewares/AdminAuthMiddleware');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/karyashala') // Uploads folder where files will be stored
    },
    filename: function (req, file, cb) {
        // Use original file name with a timestamp to avoid overwriting files with the same name
        cb(null, Date.now() + '-' + file.originalname)
    }
});
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: storage })
const multipleUpload = upload.fields([{ name: "thumbnail", maxCount: 1 }, { name: "media", maxCount: 1 }])
const router = express.Router();

router.route("/getallkaryashala").get(getKaryashala);
router.route("/getkaryashalabyid/:id").get(getKaryashalaById);
router.route("/addkaryashala")
    .post(adminAuthenticateToken, multipleUpload, addKaryashala)
router.route("/deletekaryashala/:id").delete(adminAuthenticateToken, multipleUpload,deleteKaryashalaById)
module.exports = router;
