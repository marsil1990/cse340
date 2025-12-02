const resModel = require("../models/reservation-model");
const jwt = require("jsonwebtoken");
const utilities = require("../utilities/index");
const invModel = require("../models/inventory-model");

async function reserve(req, res) {
  const inv_id = req.body.inv_id;
  const account_id = jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET
  ).account_id;
  try {
    const data = await resModel.insertReserve(account_id, inv_id);
    if (data) {
      req.flash("notice", "The vehicle has been reserved correctly");
      return res.redirect(`/inv/detail/${inv_id}`);
    } else {
      req.flash("notice", "The reserve faild");
      return res.redirect(`/inv/detail/${inv_id}`);
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error in the processing.");
    res.status(501).redirect(`/inv/detail/${inv_id}`);
  }
}

async function reservations(req, res) {
  const account_id = res.locals.account_id;
  const vehicles = [];
  let nav = await utilities.getNav();
  try {
    const reservations = await resModel.reservationBYAccount_id(account_id);
    for (const element of reservations) {
      const data = await invModel.getVehicleDetails(element.inv_id);
      vehicles.push(data[0]);
    }
    const grid = await utilities.buildReservations(vehicles);
    res.render("reservation/reservations", {
      title: "My reservations",
      nav,
      grid,
      errors: null,
    });
  } catch (error) {
    req.flash("notice", "Sorry, there was an error in the processing.");
    res.status(501).redirect("/account");
  }
}

async function deleteReservation(req, res) {
  const account_id = res.locals.account_id;
  const inv_id = req.body.inv_id;
  console.log(account_id, inv_id);
  try {
    const data = await resModel.deleteReservation(account_id, inv_id);
    if (data) {
      req.flash("notice", "The reserve has been deleted successfuly");
      res.redirect("/reservation");
    } else {
      req.flash("notice", "Problems deleting your reserve");
      res.redirect("/reservation");
    }
  } catch (error) {
    req.flash("notice", "Sorry, there was an error in the processing");
    res.redirect("/reservation");
  }
}

module.exports = {
  reserve,
  reservations,
  deleteReservation,
};
