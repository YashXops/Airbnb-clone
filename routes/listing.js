const express = require("express");
const router = express.Router();
const WrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { ListingSchema,ReviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner } = require("../middleware.js");

router.get('/',async (req,res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
});

// New Listing add page
router.get("/new",isLoggedIn,(req,res) => {
    res.render("listings/new.ejs");
});

// Show Listing page
router.get('/:id',async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
                                    .populate({
                                        path : "reviews",
                                        populate : {
                                            path : "author",
                                            model : "User"
                                        }
                                    })
                                    .populate("owner");
    if(!listing) {
        req.flash("error","Listing does not exist.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
});

// Add new listing
router.post('/',WrapAsync(async (req,res,next) => {
    let result = ListingSchema.validate(req.body);
    if(result.error) {
        throw new ExpressError(400,result.error);
    }
    let newListing = new Listing({...req.body.listing,owner : req.user._id});
    
    
    await newListing.save();
    req.flash("success","New listing Created!");
    res.redirect("/listings");
}));

// Edit Listing page
router.get("/:id/edit",isLoggedIn,isOwner,async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});

// Update listing
router.put("/:id",isLoggedIn,isOwner,async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings`);
});

// Delete listing
router.delete("/:id",isLoggedIn,isOwner,async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
});

module.exports = router;