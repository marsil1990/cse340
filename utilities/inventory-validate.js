const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

validate = {};

validate.newInventoryRules = () => [
  body("classification_id")
    .notEmpty()
    .withMessage("Please choose a classification.")
    .bail()
    .isInt({ min: 1 })
    .withMessage("Invalid classification.")
    .toInt(),

  body("inv_make")
    .trim()
    .notEmpty()
    .withMessage("Provide a make.")
    .bail()
    .matches(/^[A-Za-z0-9][A-Za-z0-9 \-]{2,}$/)
    .withMessage("Min 3 chars. Letters, numbers, spaces, and - only."),

  body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Provide a model.")
    .bail()
    .matches(/^[A-Za-z0-9][A-Za-z0-9 \-]{2,}$/)
    .withMessage("Min 3 chars. Letters, numbers, spaces, and - only."),

  body("inv_description")
    .trim()
    .notEmpty()
    .withMessage("Provide a description.")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Min 10 characters."),

  body("inv_image")
    .trim()
    .notEmpty()
    .withMessage("Provide an image path.")
    .bail()
    .matches(/^\/images\/vehicles\/[^\/]+\.(?:png|jpe?g|webp)$/i)
    .withMessage(
      "Path must start with /images/vehicles/ and end with .png/.jpg/.jpeg/.webp"
    ),

  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Provide a thumbnail path.")
    .bail()
    .matches(/^\/images\/vehicles\/[^\/]+\.(?:png|jpe?g|webp)$/i)
    .withMessage(
      "Path must start with /images/vehicles/ and end with .png/.jpg/.jpeg/.webp"
    ),

  body("inv_price")
    .trim()
    .notEmpty()
    .withMessage("Provide a price.")
    .bail()
    .matches(/^\d+(?:\.\d{1,2})?$/)
    .withMessage(
      "Use an integer or a decimal with up to 2 decimals (e.g., 12000 or 12000.99)."
    ),

  body("inv_year")
    .trim()
    .notEmpty()
    .withMessage("Provide a year.")
    .bail()
    .isInt({ min: 1950, max: 2099 })
    .withMessage(`Use a valid 4-digit year (1950 - 2099).`)
    .toInt(),

  body("inv_miles")
    .trim()
    .notEmpty()
    .withMessage("Provide miles.")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Digits only (0 or more).")
    .toInt(),

  body("inv_color")
    .trim()
    .notEmpty()
    .withMessage("Provide a color.")
    .bail()
    .matches(/^[A-Za-z0-9][A-Za-z0-9 \-]{2,}$/)
    .withMessage("Min 3 chars. Letters, numbers, spaces, and - only."),
];

validate.checkNewInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  errors.array().forEach((e) => req.flash("notice", e.msg));
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let classificationList = await utilities.buildClassificationList(
    classification_id
  );
  console.log(classificationList);
  return res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  });
};

module.exports = validate;
