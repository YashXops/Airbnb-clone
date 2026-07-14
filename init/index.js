const mongoose = require("mongoose");
const details = require("./data.js");
const Listings = require("../models/listing.js");

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

const initDB = async() => {
    await Listings.deleteMany({});
    await Listings.insertMany(details.data);
    console.log("data initialised");
}

initDB();