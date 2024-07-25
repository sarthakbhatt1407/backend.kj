const express = require('express');
const { getAllCreator, getCreatorById, getAllApprovedCreators } = require('../Controllers/CreatorController');

const router = express.Router();

router.route("/getallcreators").get(getAllCreator);
router.route("/getallapprovedcreators").get(getAllApprovedCreators);
router.route("/getcreatorsbyid/:id").get(getCreatorById);
router.route("/getcreatorchannels/:creatorid").get(getCreatorById);

module.exports = router;
