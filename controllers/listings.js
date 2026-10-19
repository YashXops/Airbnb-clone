const Listing = require("../models/listing");
const WrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError");
const { ListingSchema,ReviewSchema } = require("../schema.js");
const map_token = process.env.MAP_API_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: map_token });

module.exports.index = async (req,res) => {
    const allListings = await Listing.find();
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNew = (req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
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
};

module.exports.addListing = WrapAsync(async (req,res,next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
        }).send();

    let result = ListingSchema.validate(req.body);
    let url = req.file.path;
    let filename = req.file.filename;

    if(result.error) {
        throw new ExpressError(400,result.error);
    }
    let newListing = new Listing({...req.body.listing,owner : req.user._id});
    newListing.image = {
        url: url,
        filename: filename,
    };
    newListing.geometry = response.body.features[0].geometry;
    
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success","New listing Created!");
    res.redirect("/listings");
});

module.exports.editListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
};

module.exports.updateListing = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();
    req.flash("success","Listing Updated!");
    res.redirect(`/listings`);
};

module.exports.deleteListing = async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};