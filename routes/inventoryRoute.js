// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities");
// Middleware to restrict access to only employees and admins
const restrictedAccess = utilities.checkAdminOrEmployee;

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to build inventory detail view by vehicle ID
router.get("/detail/:inv_id", invController.buildVehicleDetail);

//Router for management route (redirect for '/inv/' to management) - now with restriction
router.get("/", restrictedAccess, utilities.handleErrors(invController.buildManagement));

// Route to display the add classification form - now with restriction
router.get("/add-classification", restrictedAccess, utilities.handleErrors(invController.buildAddClassification));

// Route to handle form submission to add new classification - now with restriction
router.post("/add-classification", restrictedAccess, utilities.handleErrors(invController.addClassification));

// Route to display the add inventory form - now with restriction
router.get("/add-inventory",restrictedAccess, utilities.handleErrors(invController.buildAddInventory));

// Route to handle form submission for adding a new inventory item - now with restriction
router.post("/add-inventory",restrictedAccess, utilities.handleErrors(invController.addInventory));


router.get("/trigger-error", (req, res, next) => {
    const error = new Error("This is a custom-triggered error");
    error.status = 500; // Set the status to 500 to simulate a server error
    next(error); // Pass the error to the global error handlerMore actions
});

//Route on getInventory by classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to display the edit inventory item view by inventory_id - now with restriction
router.get("/edit/:inv_id", restrictedAccess, utilities.handleErrors(invController.editInventoryView));

// Route to handle the incoming request for updating an inventory item with validation - now with restriction
router.post(
  "/edit-inventoryView", restrictedAccess, // Validate inventory data on update - now with restriction
  utilities.handleErrors(invController.updateInventory)
)

//Route to deliver delete confirmation view
router.post(
  "/delete", // Validate inventory data on update
  utilities.handleErrors(invController.deleteInventoryItem)

)
// Route to display the delete inventory item view by inventory_id - now with restriction
router.get("/delete/:inv_id", restrictedAccess, utilities.handleErrors(invController.deleteInventoryView));

module.exports = router;