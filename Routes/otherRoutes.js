const express = require('express');
const { getBanner, mostPlayedAudio, getNotificationsController, getDashInfo } = require('../Controllers/OtherControllers');
const adminAuthenticateToken = require('../Middlewares/AdminAuthMiddleware');

const router = express.Router();

router.route("/getbanner").get(getBanner);
router.route("/gettopaudios").get(mostPlayedAudio);
router.route("/getnotifications").get(getNotificationsController);
router.route("/getdashinfo").get(adminAuthenticateToken, getDashInfo)

module.exports = router;
