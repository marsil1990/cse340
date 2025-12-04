const express = require("express");
const router = new express.Router();
const reservationController = require("../controllers/reservationController");
const utilities = require("../utilities/");
const regValidate = require("../utilities/reservation-validetion");

router.post(
  "/reserve",
  regValidate.newreservationRules(),
  regValidate.checkReservationData,
  utilities.handleErrors(reservationController.reserve)
);

router.get("/", utilities.handleErrors(reservationController.reservations));

router.post(
  "/deletereservation",
  regValidate.newreservationRules(),
  regValidate.checkReservationData,
  utilities.handleErrors(reservationController.deleteReservation)
);

module.exports = router;
