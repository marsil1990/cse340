const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildInventoryGrid = async function (data) {
  let grid = "";

  if (Object.keys(data).length > 0) {
    const price = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(data.inv_price ?? 0);

    const miles = new Intl.NumberFormat("en-US").format(data.inv_miles ?? 0);

    grid += '<section class="specific-vehicle">';
    grid +=
      '<div class="vehicle-img">' +
      '<img src="' +
      data.inv_image +
      '"' +
      ' alt="Image of ' +
      data.inv_make +
      " " +
      data.inv_model +
      '">' +
      "</div>" +
      '<div class="vehicle-details">';

    grid +=
      "<h3>" + data.inv_make + " " + data.inv_model + " Details" + "</h3>";

    grid += '<ul id="details">';
    grid += "<li><strong>Price</strong>: " + price + "</li>";
    grid +=
      "<li><strong>Description</strong>: " + data.inv_description + "</li>";
    grid += "<li><strong>Color</strong>: " + data.inv_color + "</li>";
    grid += "<li><strong>Miles</strong>: " + miles + "</li>";
    grid += "</ul></div></section>";
  } else {
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

Util.buildClassificationList = async function (classification_id = null) {
  const data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected";
    }
    classificationList += `>${row.classification_name}</option>`;
  });
  classificationList += "</select>";
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  res.locals.accountData = null;
  res.locals.loggedin = false;
  res.locals.userName = null;
  res.locals.type = null;
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.loggedin = true;
        res.locals.userName = accountData.account_firstname;
        res.locals.type = accountData.account_type;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

Util.checkLoginAdminOrEmployee = (req, res, next) => {
  let payload;
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  }

  if (
    res.locals.loggedin &&
    (payload.account_type === "Admin" || payload.account_type === "Employee")
  ) {
    next();
  } else {
    req.flash(
      "notice",
      "Restricted area, Only for Admin or Employee. Please log in."
    );
    return res.redirect("/account/login");
  }
};

module.exports = Util;
