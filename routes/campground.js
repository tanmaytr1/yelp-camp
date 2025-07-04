const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync"); // Import the catchAsync function
const Campground = require("../models/campground");
const isLoggedIn = require("../middleware/isLoggedIn"); // Import the isLoggedIn middleware



router.get("/", isLoggedIn,catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));

router.get("/new",isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.post("/",isLoggedIn, catchAsync (async (req, res) => {
  
  const { campground } = req.body; // Get user-inputted fields
  const newCampground = new Campground(campground);

  await newCampground.save();
  req.flash("success","successfully made a new campground!");
  res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get("/:id",isLoggedIn, catchAsync(async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id).populate('reviews'); // Populate reviews to get review details
  res.render("campgrounds/show", { campground });
}));

router.get("/:id/edit",isLoggedIn, catchAsync(async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
}));

router.put("/:id",isLoggedIn,catchAsync( async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { 
    $set: req.body.campground // Only updates submitted fields
  }, { new: true }); // Returns updated document
    req.flash("success","successfully edited the campground!");

  res.redirect(`/campgrounds/${campground._id}`);
}));



router.delete("/:id",isLoggedIn, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id); // Correct method for deleting a document by its ID
  // Optionally, if you have associated reviews, you'd handle them here too
  // e.g., await Review.deleteMany({ _id: { $in: campground.reviews }}); // if you decide to delete reviews when campground is deleted
      req.flash("success","successfully deleted campground!");

  res.redirect("/campgrounds"); // Redirect to the campgrounds index page after deletion
}));

module.exports = router;