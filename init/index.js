require("dotenv").config({
    path: "../.env"
});

console.log("MAP TOKEN:", process.env.MAP_API_TOKEN);
const mongoose = require("mongoose");
const details = require("./data.js");
const Listings = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({
    accessToken: process.env.MAP_API_TOKEN
});
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to DB");
    })
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {

    await Listings.deleteMany({});

    for (let obj of details.data) {

        const response = await geocodingClient
            .forwardGeocode({
                query: obj.location,
                limit: 1
            })
            .send();

        obj.geometry = response.body.features[0].geometry;

        obj.owner = "6a8239f320bfe27469b27be0";
    }

    await Listings.insertMany(details.data);

    console.log("data initialised");
}

initDB();