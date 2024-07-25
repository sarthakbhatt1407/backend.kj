const express = require('express')
const { getAudioBooks, getAudioBooksById, addAudioBook, deleteAudioBookById } = require('../Controllers/AudioBookController')
const router = express.Router()
const multer = require('multer');
const adminAuthenticateToken = require('../Middlewares/AdminAuthMiddleware');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/audiobooks') // Uploads folder where files will be stored
    },
    filename: function (req, file, cb) {
        // Use original file name with a timestamp to avoid overwriting files with the same name
        cb(null, Date.now() + '-' + file.originalname)
    }
});
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: storage })
const multipleUpload=upload.fields([{name:"audio",maxCount:1},{name:"cover",maxCount:1}])
router.route("/getallaudiobooks").get(getAudioBooks)
router.route("/getaudiobooksbyid/:id").get(getAudioBooksById)
router.route("/addaudiobook").post(adminAuthenticateToken,multipleUpload,addAudioBook)
router.route("/delteaudiobook/:id")
    .delete(adminAuthenticateToken,deleteAudioBookById);
module.exports = router