const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema,ReviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,reviewOwner } = require("../middleware.js");
const ReviewController = require("../controllers/review.js");

router.post("/",isLoggedIn,ReviewController.addReview);
router.delete("/:reviewId",isLoggedIn,reviewOwner,ReviewController.deleteReview);

module.exports = router;