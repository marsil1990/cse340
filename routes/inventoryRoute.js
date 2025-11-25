const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");
const classificationValidate = require("../utilities/classification-validation");
const inventoryValidate = require("../utilities/inventory-validate");
// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildByInventoryId)
);

router.get("/", utilities.handleErrors(invController.buildManagement));

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
  utilities.handleErrors(invController.editInventoryView)
);

router.post(
  "/update/",
  inventoryValidate.newInventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

module.exports = router;
