const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const deliveryBoyController = require("../controllers/deliveryBoys.js");
const { isAuthAPI, isDeliveryBoyAPI } = require("../middleware.js");

router.get("/orders", isAuthAPI, isDeliveryBoyAPI, wrapAsync(deliveryBoyController.viewOrderAPI));
router.patch("/orders/:id/status", isAuthAPI, isDeliveryBoyAPI, wrapAsync(deliveryBoyController.updateOrderStatusAPI));

module.exports = router;