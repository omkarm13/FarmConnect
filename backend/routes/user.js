const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const userController = require("../controllers/users.js");
const { isAuthAPI } = require("../middleware.js");

router.post("/register", wrapAsync(userController.registerUserAPI));
router.post("/login", wrapAsync(userController.loginUserAPI));
router.get("/me", isAuthAPI, wrapAsync(userController.myProfileAPI));
router.get("/profile/:id", isAuthAPI, wrapAsync(userController.userProfileAPI));
router.get("/vegetables", isAuthAPI, wrapAsync(userController.getUserVegetablesAPI));
router.put("/update", isAuthAPI, wrapAsync(userController.updateUserAPI));
router.post("/logout", wrapAsync(userController.logOutUserAPI));
router.post("/forgot-password", wrapAsync(userController.forgotPasswordAPI));
router.post("/reset-password", wrapAsync(userController.resetPasswordAPI));

module.exports = router;