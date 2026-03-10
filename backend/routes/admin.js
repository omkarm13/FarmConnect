const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const adminController = require("../controllers/admins.js");
const { isAdminAuthAPI } = require("../middleware.js");

router.post("/login", wrapAsync(adminController.adminLoginAPI));
router.get("/orders", isAdminAuthAPI, wrapAsync(adminController.viewOrdersAPI));
router.patch("/orders/:id/assign", isAdminAuthAPI, wrapAsync(adminController.assignOrdersAPI));
router.post("/logout", isAdminAuthAPI, wrapAsync(adminController.logoutAdminAPI));

module.exports = router;