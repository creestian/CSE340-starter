// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory detail view by vehicle ID
router.get("/detail/:inv_id", invController.buildVehicleDetail);

//Router for management route (redirect for '/inv/' to management)
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to display the add classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to handle form submission to add new classification
router.post("/add-classification", utilities.handleErrors(invController.addClassification));

// Route to display the add inventory form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Route to handle form submission for adding a new inventory item
router.post("/add-inventory", utilities.handleErrors(invController.addInventory));


router.get("/trigger-error", (req, res, next) => {
    const error = new Error("This is a custom-triggered error");
    error.status = 500; // Set the status to 500 to simulate a server error
    next(error); // Pass the error to the global error handlerMore actions
});

//Route on getInventory by classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;