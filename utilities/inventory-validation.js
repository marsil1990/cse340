const { body, validationResult } = require("express-validator");
const utilities = require("../utilities");

validate = {};

const text3plusRegex = /^[A-Za-z0-9][A-Za-z0-9 \-]{2,}$/;

// Imagen/Thumbnail: debe empezar con /images/vehicles/ y terminar en extensión válida
const imagePathRegex = /^\/images\/vehicles\/[^\/]+\.(?:png|jpe?g|webp)$/i;

// Precio: entero o decimal con 1–2 decimales (punto decimal)
const priceRegex = /^\d+(?:\.\d{1,2})?$/;

// Año: 1950–2099 (puedes usar isInt con rango en vez de regex)
const yearMin = 1950;
const yearMax = 2099;

// Millas: entero >= 0
// (usamos isInt para que coincida con type="number" min="0" step="1")
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
    .matches(text3plusRegex)
    .withMessage("Min 3 chars. Letters, numbers, spaces, and - only."),

  body("inv_model")
    .trim()
    .notEmpty()
    .withMessage("Provide a model.")
    .bail()
    .matches(text3plusRegex)
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
    .matches(imagePathRegex)
    .withMessage(
      "Path must start with /images/vehicles/ and end with .png/.jpg/.jpeg/.webp"
    ),

  body("inv_thumbnail")
    .trim()
    .notEmpty()
    .withMessage("Provide a thumbnail path.")
    .bail()
    .matches(imagePathRegex)
    .withMessage(
      "Path must start with /images/vehicles/ and end with .png/.jpg/.jpeg/.webp"
    ),

  body("inv_price")
    .trim()
    .notEmpty()
    .withMessage("Provide a price.")
    .bail()
    .matches(priceRegex)
    .withMessage(
      "Use an integer or a decimal with up to 2 decimals (e.g., 12000 or 12000.99)."
    ),

  body("inv_year")
    .trim()
    .notEmpty()
    .withMessage("Provide a year.")
    .bail()
    .isInt({ min: yearMin, max: yearMax })
    .withMessage(`Use a valid 4-digit year (${yearMin}–${yearMax}).`)
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
    .matches(text3plusRegex)
    .withMessage("Min 3 chars. Letters, numbers, spaces, and - only."),
];

validate.checkNewInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  errors.array().forEach((e) => req.flash("notice", e.msg));
  return res.redirect("/inv/new-inventory");
};

validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req);
  const inv_id = req.inv_id;
  if (errors.isEmpty()) return next();
  errors.array().forEach((e) => req.flash("notice", e.msg));
  return res.redirect(`/inv/edit/${inv_id}`);
};

module.exports = validate;
