const mongoose = require("mongoose");
const cities = require("./cities");
const { places, discriptors } = require("./seedHelpers");
const Campground = require("../models/campground"); // Import the model

mongoose
  .connect("mongodb://localhost:27017/yelp-camp") // Returns a promise
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;

    const camp = new Campground({
      author:"6867f5da5008990fa1b08a9e",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(discriptors)} ${sample(places)}`,
      image: "https://picsum.photos/800",
      price,
      description:
        "lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quae.",
    });

    await camp.save();
  }
};
seedDB();
