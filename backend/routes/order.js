const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const orderController = require("../controllers/orders.js");
const { isAuthAPI } = require("../middleware.js");

router.get("/", isAuthAPI, wrapAsync(orderController.showOrderAPI));
router.post("/", isAuthAPI, wrapAsync(orderController.placeOrderAPI));
router.get("/:id", isAuthAPI, wrapAsync(orderController.getOrderByIdAPI));
router.delete("/:id", isAuthAPI, wrapAsync(orderController.cancelOrderAPI));

module.exports = router;
