const express = require('express');
const LiveController = require('../Controllers/LiveController');

const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/lives') // Uploads folder where files will be stored
    },
    filename: function (req, file, cb) {
        // Use original file name with a timestamp to avoid overwriting files with the same name
        cb(null, Date.now() + '-' + file.originalname)
    }
});
// const upload = multer({ dest: 'uploads/' })
const upload = multer({ storage: storage })
const multipleUpload = upload.fields([{ name: "thumbnail", maxCount: 1 }])
router.get("/getAllLiveEvents", LiveController.getAllLiveEvents);
router.get("/getLiveEventById/:id", LiveController.getLiveEventById);
router.get("/getTop5LiveEvents", LiveController.getTop5LiveEvents);
router.get("/getLiveEventsByInterest/:interestId", LiveController.getLiveEventsByInterest);

router.put("/updateLiveEvent/:eventId",LiveController.updateLiveEvent);
router.post("/addlive",multipleUpload,LiveController.addLiveEventController)
module.exports = router;
