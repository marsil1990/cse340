const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

validate = {};

validate.newreservationRules = () => [
  body("inv_id")
    .notEmpty()
    .withMessage("It can't be empty.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Invalid inventory.")
    .toInt(),
];

validate.checkReservationData = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  errors.array().forEach((e) => req.flash("notice", e.msg));
  return res.redirect(`/reservation`);
};

module.exports = validate;
