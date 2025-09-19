//  routes/errorRoute.js
const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const { boom } = require("../controllers/errorController");

router.get("/boom", utilities.handleErrors(boom));
module.exports = router;
