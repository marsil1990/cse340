// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const classificationValidate = require("../utilities/classification-validation");
const inventoryValidate = require("../utilities/inventory-validation");
const Util = require("../utilities/");
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventory)
);
router.get(
  "/",
  utilities.checkLoginAdminOrEmployee,
  utilities.handleErrors(invController.buildManagement)
);

router.get(
  "/new-classification",
  utilities.handleErrors(invController.buildNewClassification)
);

router.post(
  "/new-classification",
  classificationValidate.registerClassificationRules(),
  classificationValidate.checkclassificationData,
  utilities.handleErrors(invController.addClassification)
);

router.get(
  "/new-inventory",
  utilities.handleErrors(invController.buildNewInventory)
);

router.post(
  "/new-inventory",
  inventoryValidate.newInventoryRules(),
  inventoryValidate.checkNewInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inventory_id",
  utilities.handleErrors(invController.getInventorybyIdToUpdate)
);

router.post(
  "/update/",
  inventoryValidate.newInventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

router.get(
  "/delete/:inventory_id",
  utilities.handleErrors(invController.getInventoryByIdToDelete)
);

router.post("/delete/", utilities.handleErrors(invController.deleteInventory));
module.exports = router;
