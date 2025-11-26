const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    } else {
      req.flash(
        "message notice",
        "Please check your credentials and try again."
      );
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error("Access Forbidden");
  }
}

async function buildManagement(req, res, next) {
  let nav = await utilities.getNav();
  let payload;
  let account_id;
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    account_id = payload.account_id;
  }
  req.flash("notice", "You're logged in");
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    account_id,
  });
}

async function accountLogout(req, res, nex) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return next(err);
      }
      res.clearCookie("sessionId");
      res.clearCookie("jwt");

      return res.status(400).redirect("/");
    });
  } catch (erro) {
    console.error("Logout error:", error);
    next(error);
  }
}

async function getAccountToEdit(req, res, next) {
  const account_id = parseInt(req.params.account_id);
  let nav = await utilities.getNav();
  const itemData = await accountModel.getAccountById(account_id);

  res.render("account/edit-account", {
    title: "Edit Acount",
    title1: "Change Password",
    nav,
    errors: null,
    account_id: itemData.account_id,
    account_firstname: itemData.account_firstname,
    account_lastname: itemData.account_lastname,
    account_email: itemData.account_email,
  });
}

async function editAccount(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } =
    req.body;

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    const accessToken = jwt.sign(
      updateResult,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: 3600 * 1000,
      }
    );
    if (process.env.NODE_ENV === "development") {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    } else {
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 3600 * 1000,
      });
    }
    req.flash("notice", "Congratulation your information has been updated.");
    return res.redirect("/account/");
  } else {
    req.flash("notice", "Sorry, the updated failed.");
    res.status(501).render("account/edit-account", {
      nav,
      title: "Edit Acount",
      title1: "Change Password",
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

async function editPasswordAccount(req, res) {
  const {
    account_id,
    account_password,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;
  let nav = await utilities.getNav();
  console.log(account_id, account_password);
  try {
    const accountData = await accountModel.getAccountById(account_id);
    console.log(accountData);
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      req.flash(
        "notice",
        "Sorry, It's the same password you were using. Enter another one."
      );
      res.status(501).redirect("/account/");
    } else {
      hashedPassword = await bcrypt.hashSync(account_password, 10);
      const regResult = await accountModel.updatePasswordAccount(
        account_id,
        hashedPassword
      );
      if (regResult) {
        req.flash(
          "notice",
          "Congratulation your information has been updated."
        );
        return res.redirect("/account/");
      }
    }
  } catch (eror) {
    req.flash("notice", "Sorry, there was an error in the processing.");
    res.status(501).render("account/edit-account", {
      nav,
      title: "Edit Acount",
      title1: "Change Password",
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
    });
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  accountLogout,
  getAccountToEdit,
  editAccount,
  editPasswordAccount,
};
