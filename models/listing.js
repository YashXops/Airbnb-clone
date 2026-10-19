const mongoose = require("mongoose");
const scheme = mongoose.Schema;
const Review = require("./reviews.js");

const listingScheme = new scheme({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        filename: String,
        url: {
            type: String,
            // default:
            //     "./images/360_F_759052952_40Jv2AEgp30uLRWe5gpAXVS2409X4KpU.webp",
            // set: (v)=>
            //     v === ""
            //         ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
            //         : v,  
            }
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: scheme.Types.ObjectId,
            ref: "review",
        },
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String, 
            enum: ['Point'], 
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
  }
});

listingScheme.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    };
});

const listing = mongoose.model("listing",listingScheme);
module.exports = listing;