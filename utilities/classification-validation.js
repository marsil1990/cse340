const utilities = require(".");
const { body, validationResult } = require("express-validator");
const classificationModel = require("../models/inventory-model");
const validate = {};
/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registerClassificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification can't be empty")
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage(
        "Classification name must contain only letters and numbers, no spaces or special characters."
      )
      .custom(async (classification_name) => {
        const classificationExists =
          await classificationModel.checkExistingClassification(
            classification_name
          );
        if (classificationExists) {
          throw new Error(
            "Classification exists. Please enter another classification"
          );
        }
      }),
  ];
};

validate.checkclassificationData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    req.flash("notice", errors.errors[0].msg);
    return res.redirect("/inv/new-classification");
  }
  next();
};

module.exports = validate;
