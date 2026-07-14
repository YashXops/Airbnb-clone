const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema,ReviewSchema} = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

router.post("/",WrapAsync(async(req,res) => {
    let result = ReviewSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400,result.error);
    }
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}));

router.delete("/:reviewId",WrapAsync(async(req,res) => {
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    res.redirect(`/listings/${id}`); 
}));

module.exports = router;