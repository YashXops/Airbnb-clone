const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {ListingSchema,ReviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

router.get('/',async (req,res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
});

// New Listing add page
router.get("/new",(req,res) => {
    res.render("listings/new.ejs");
});

// Show Listing page
router.get('/:id',async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
});

// Add new listing
router.post('/',WrapAsync(async (req,res,next) => {
    let result = ListingSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400,result.error);
    }
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// Edit Listing page
router.get("/:id/edit",async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// Update listing
router.put("/:id",async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings`);
});

// Delete listing
router.delete("/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

module.exports = router;