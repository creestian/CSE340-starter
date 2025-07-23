// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities"); // Error handler
const regValidate = require('../utilities/account-validation')

// Route to handle login view when "My Account" is clicked
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Route to handle registration view when Signup is clicked (UNIT 4 ACTIVITY)
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )


// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Task 6 - Assignment 5
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.redirect('/'); // Handle error, if needed
    }
    res.clearCookie('sessionId');
    res.clearCookie('jwt');
    res.redirect('/'); // Redirect to homepage or login page
  });
});

// Account management route with authentication check Activity 5
router.get(
  "/",
  utilities.checkAuth, // Middleware to verify login
  utilities.handleErrors(accountController.buildAccountManagement)
);

/***********************************
 * Task 4 - Assignment 5
 * Routes for updating
 *********************************** */

// Route to display the account update form
router.get("/update/:account_id", utilities.handleErrors(accountController.buildAccountUpdateView));

// Route to handle account information update
router.post(
  "/update/:account_id",
   // Server-side validation middleware for account update
  utilities.handleErrors(accountController.updateAccount)
);

// Route to handle password update
router.post(
  "/change-password",
  utilities.validatePassword, // Server-side validation middleware for password
  utilities.handleErrors(accountController.changePassword)
);

// Export the router for use in server.js
module.exports = router;