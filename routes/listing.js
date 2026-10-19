const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner,validateListing,validateListingUpdate } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route('/')
.get(ListingController.index)
.post(isLoggedIn,upload.single("listing[image]"),validateListing,ListingController.addListing);

// New Listing add page
router.get("/new",isLoggedIn,ListingController.renderNew);

router.route('/:id')
.get(ListingController.showListing)
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListingUpdate,wrapAsync(ListingController.updateListing))
.delete(isLoggedIn,isOwner,ListingController.deleteListing);

// Edit Listing page
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editListing));

module.exports = router;