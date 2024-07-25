const express = require('express');
const { getCircles, getCirclesById, joinCircle } = require('../Controllers/CircleController');

const router = express.Router();

router.route("/getallcircles").get(getCircles);
router.route("/getcirclebyid/:id").get(getCirclesById);
router.route("/joincircle").post(joinCircle)
module.exports = router;
