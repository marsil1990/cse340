const express = require("express");
const router = new express.Router();
const reservationController = require("../controllers/reservationController");
const utilities = require("../utilities/");

router.post("/reserve", utilities.handleErrors(reservationController.reserve));

router.get("/", utilities.handleErrors(reservationController.reservations));

router.post(
  "/deletereservation",
  utilities.handleErrors(reservationController.deleteReservation)
);

module.exports = router;
