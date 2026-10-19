const Listing = require("./models/listing");
const { ListingSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.validateListing = (req, res, next) => {
    
    let { error } = ListingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }

    if (!req.file) {
        throw new ExpressError(400, "Image is required");
    }

    next();
};

module.exports.validateListingUpdate = (req, res, next) => {
    console.log(req.body);
    let { error } = ListingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }

    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === 'GET') {
            req.session.redirectUrl = req.originalUrl;
        }
        
        else if (req.method === 'POST' && req.originalUrl.includes('/reviews')) {
            req.session.pendingReview = {   
                listingId: req.params.id,
                review: req.body.review
            };
            req.session.returnTo = `/listings/${req.params.id}`;
        }
        req.flash("error", "Please login");
        return res.redirect("/login");
    }

    next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
    res.locals.redirectUrl = req.session.redirectUrl;
    next();
};

module.exports.isOwner = async (req,res,next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(req.user._id)) {
        req.flash("error", "You are not the owner of the listing.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.reviewOwner = async (req,res,next) => {
    let { id } = req.params;
    let { reviewId } = req.params; 
    const listing = await Listing.findById(id)
                                    .populate({
                                        path : "reviews",
                                        populate : {
                                            path : "author",
                                            model : "User"
                                        }
                                    });
    const matchedreview = listing.reviews.find(review => review._id.toString() === reviewId) || null;
    
    if(matchedreview.author._id.toString() !== req.user._id.toString()) {
        req.flash("error", "You are not the owner of the review.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

