const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
   
    res.render("account/login", {
      title: "Login",
      nav,
    })
  }

/* ****************************************
*  Deliver registration view unit4 activity
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
 
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname,
    account_lastname, 
    account_email,
    account_password 
  } = req.body


  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )
  console.log(req.body);  // Log the incoming data

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
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
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      req.session.loggedin = true; // Set logged-in status in session
      req.session.account_firstname = accountData.account_firstname; // Assignment 5 passing the logged in name to navigator
      req.session.accountData = accountData; // Store account data in session
      return res.redirect("/account/"); // Redirect to account management
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
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

/* ****************************************
*  Process account management view
* *************************************** */
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav();
  
  // Render account management view if authenticated
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    notice: req.flash("notice",'Congratulations, you are in!'),
    loggedin: req.session.loggedin, // Pass logged-in status
    accountData: req.session.accountData, // Pass account data
  });
}

/* ****************************************
*  Task 4 - Assignment 5 
*  Display the account update view
* *************************************** */
async function buildAccountUpdateView(req, res) {
  const account_id = parseFloat(req.params.account_id);
  let nav = await utilities.getNav();
  const accountData = await accountModel.getAccountById(account_id);
  const userName = `${accountData.account_firstname}`

  try {
     res.render("account/update", {
      title: "Update Account of " + userName,
      nav,
      accountData :accountData,
      errors: null,
    });
  } catch (error) {
    req.flash("notice", "Error loading account update view.");
    res.status(500).render("account", {
      title: "Update Account",
      nav,
      errors: null,
      accountData : accountData,
    });
  }
}

/* ****************************************
*  Task 4 - Assignment 5
*  Process account information update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  const account_id = req.session.account_id; // Retrieve account_id from session

  try {
    // Check if email already exists and isn't the user's current email
    const existingAccount = await accountModel.getAccountByEmail(account_email);
    if (existingAccount && existingAccount.account_id !== account_id) {
      req.flash("notice", "This email is already in use. Please use another email.");
      // update for Task 5 - Assignment 5
      return res.status(400).render("account/management", {
        title: "Update Account",
        nav,
        errors: null,
        account_firstname,
        account_lastname,
        account_email,
      });
    }

    const updateResult = await accountModel.updateAccountInfo(account_id, account_firstname, account_lastname, account_email);

        if (updateResult) {
          req.flash("notice", "Account information updated successfully.");
          return res.redirect("/account/"); // Redirect to account management
          res.status(201).render("account/management", {
            title: "Account Management",
            nav,
            errors: null,
          });
        } else {
          req.flash("notice", "Sorry, the update failed.");
          return res.status(501).render("account/management", {
            title: "Account Management",
            nav,
            accountData: req.body,
            errors: ["Update failed due to a server error."]
          });
        }
      } catch (error) {
    req.flash("notice", "Error updating account information.");
    res.status(500).render("account/management", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
}

/* ****************************************
*  Task 4 - Assignment 5
*  Process password update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  const account_id = parseInt(req.params.account_id); // ✅ Fix applied here

  try {
    const existingAccount = await accountModel.getAccountByEmail(account_email);

    if (existingAccount && existingAccount.account_id !== account_id) {
      req.flash("notice", "This email is already in use. Please use another email.");
      return res.status(400).render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData: req.body,
      });
    }

    const updateResult = await accountModel.updateAccountInfo(
      account_id,
      account_firstname,
      account_lastname,
      account_email
    );

    if (updateResult) {
      req.flash("notice", "Account information updated successfully.");
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Sorry, the update failed.");
      return res.status(501).render("account/update", {
        title: "Update Account",
        nav,
        accountData: req.body,
        errors: ["Update failed due to a server error."],
      });
    }
  } catch (error) {
    console.error("Update error:", error.message);
    req.flash("notice", "Error updating account information.");
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData: req.body,
    });
  }
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, buildAccountUpdateView, updateAccount, changePassword }