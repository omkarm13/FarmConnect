const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { isReviewAuthorAPI, isAuthAPI } = require("../middleware.js");
const reviewsController = require("../controllers/reviews.js");

router.post("/", isAuthAPI, wrapAsync(reviewsController.createReviewAPI));
router.delete("/:reviewId", isAuthAPI, isReviewAuthorAPI, wrapAsync(reviewsController.deleteReviewAPI));

module.exports = router;