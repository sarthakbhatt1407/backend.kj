const express = require('express');
const { getShikshas, getShikshaById } = require('../Controllers/ShikshaController');
const router = express.Router();

router.route("/getallshikshas").get(getShikshas);
router.route("/getshikshabyid/:id").get(getShikshaById);

module.exports = router;
