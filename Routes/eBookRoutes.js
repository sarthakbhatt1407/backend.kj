const express = require('express')
const { getAllEbooks, getEbookById, addEbook, deleteEbookById } = require('../Controllers/EbookController')

const router = express.Router()
const multer = require('multer');
const adminAuthenticateToken = require('../Middlewares/AdminAuthMiddleware');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/ebooks') // Uploads folder where files will be stored
    },
    filename: function (req, file, cb) {
        // Use original file name with a timestamp to avoid overwriting files with the same name
        cb(null, Date.now() + '-' + file.originalname)
    }
});
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: storage })
const multipleUpload=upload.fields([{name:"book",maxCount:1},{name:"cover",maxCount:1}])
router.route("/getallebooks").get(getAllEbooks)
router.route("/getebookbyid/:id").get(getEbookById)
router.route("/addebook").post(adminAuthenticateToken, multipleUpload,addEbook)
router.route("/deleteebook/:id").delete(adminAuthenticateToken, multipleUpload,deleteEbookById)
module.exports = router