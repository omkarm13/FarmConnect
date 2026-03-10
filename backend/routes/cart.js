const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const cartController = require("../controllers/carts.js");
const { isAuthAPI } = require("../middleware.js");

router.get("/", isAuthAPI, wrapAsync(cartController.viewCartAPI));
router.post("/:vegId", isAuthAPI, wrapAsync(cartController.addCartAPI));
router.put("/:id", isAuthAPI, wrapAsync(cartController.updateCartAPI));
router.delete("/:vegId", isAuthAPI, wrapAsync(cartController.deleteCartAPI));

module.exports = router;
