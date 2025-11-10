const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const { error500 } = require("../controllers/errorController");

router.get("/error500", utilities.handleErrors(error500));
module.exports = router;
