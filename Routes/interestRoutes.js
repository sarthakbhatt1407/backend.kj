const express = require('express');
const { getAllInterests, getInterestById, addInterest } = require('../Controllers/InterestController');
const adminAuthenticateToken = require('../Middlewares/AdminAuthMiddleware');

const router = express.Router();

// Get all interests
router.route("/getallinterests").get(getAllInterests);

// Get interest by ID
router.route("/getinterestbyid/:id").get(getInterestById);

// Add interest
router.route("/addinterest").post(adminAuthenticateToken, addInterest);

module.exports = router;
