const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inventoryId;
  const data = await invModel.getVehicleDetails(inv_id);
  const grid = await utilities.buildInventoryGrid(data[0]);
  let nav = await utilities.getNav();
  const className =
    data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/inventory", {
    title: className,
    nav,
    grid,
  });
};

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  });
};

invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "New Classification",
    nav,
    errors: null,
  });
};

invCont.addClassification = async function (req, res) {
  // let nav = await utilities.getNav();
  const { classification_name } = req.body;
  console.log(req);
  const regResult = await invModel.registerClassification(classification_name);
  if (regResult) {
    req.flash("notice", `Classification "${classification_name}" created.`);
    return res.redirect("/inv"); // o "/inv/new-classification" si querés seguir cargando
  } else {
    return res.redirect("/inv");
  }
};

invCont.buildNewInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(null);
  res.render("inventory/add-inventory", {
    title: "Add Vehicle",
    nav,
    classificationList,
    errors: null,
  });
};

invCont.addInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
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

  try {
    const result = await invModel.insertInventory({
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
    });

    if (result && result.rowCount === 1) {
      req.flash(
        "notice",
        `Vehicle "${inv_year} ${inv_make} ${inv_model}" added.`
      );
      return res.redirect("/inv");
    }

    req.flash("notice", "The vehicle could not be added.");
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    return res.status(400).render("inventory/add-inventory", {
      title: "Add Vehicle",
      nav,
      classificationList,
      errors: null,
      ...req.body,
    });
  } catch (err) {
    console.error(err);
    req.flash("notice", "Server error while adding the vehicle.");
    return res.redirect("/inv/new-inventory");
  }
};

module.exports = invCont;
