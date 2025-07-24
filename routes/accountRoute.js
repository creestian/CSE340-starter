// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities"); // Error handler
const regValidate = require('../utilities/account-validation')
const restrictedAccess = utilities.checkAdminOrEmployee; // Final Enhancement

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

/* ****************************************
*  Final Enhancement
*  
* *************************************** */

// Route to display the contact form - Final Enhancement
router.get("/contact", accountController.buildContactForm);

// Route to handle contact form submission - Final Enhancement
router.post("/contact", accountController.processContactForm);

// Route to display all messages in admin view - Final Enhancement
router.get("/admin/messages",restrictedAccess, accountController.viewMessages);

// Route to display the profile update form
router.get("/updateProfile", accountController.buildProfileUpdate);

// Route to process updating general account information
router.post("/updateProfile/info", accountController.processUpdateAccountInfo);

// Route to process updating the account password
router.post("/updateProfile/password", accountController.processUpdatePassword);

// Add Message Deletion Feature - Final Enhancement
router.post('/admin/messages/delete/:id', restrictedAccess, accountController.deleteMessage)
// Export the router for use in server.js
module.exports = router;