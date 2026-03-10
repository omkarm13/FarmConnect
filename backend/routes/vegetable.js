const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isOwnerAPI, isFarmerAPI, isAuthAPI } = require("../middleware.js");
const vegetableController = require("../controllers/vegetables.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/", wrapAsync(vegetableController.indexVegetableAPI));
router.post("/", isAuthAPI, isFarmerAPI, upload.single("image"), wrapAsync(vegetableController.createVegetableAPI));
router.get("/:id", wrapAsync(vegetableController.showVegetableAPI));
router.put("/:id", isAuthAPI, isFarmerAPI, isOwnerAPI, upload.single("image"), wrapAsync(vegetableController.updateVegetableAPI));
router.delete("/:id", isAuthAPI, isFarmerAPI, isOwnerAPI, wrapAsync(vegetableController.deleteVegetableAPI));

module.exports = router;
