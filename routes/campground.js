const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const isLoggedIn = require("../middleware/isLoggedIn"); // Import the isLoggedIn middleware

router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}));

// Apply isLoggedIn to the GET route for new campground form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Apply isLoggedIn to the POST route for creating a new campground
router.post("/", isLoggedIn, catchAsync(async (req, res) => { // <-- ADD isLoggedIn HERE
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    campground.author = req.user._id; // Set the author to the logged-in user
    await newCampground.save();
    req.flash("success", "successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get("/:id", catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate('reviews').populate('author'); // Populate the author field
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds'); // Redirect to index page
    }
    console.log(campground);
    res.render("campgrounds/show", { campground });
}));

// Apply isLoggedIn to the edit routes
router.get("/:id/edit", isLoggedIn, catchAsync(async (req, res) => { // <-- ADD isLoggedIn HERE
    const id = req.params.id;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", isLoggedIn, catchAsync(async (req, res) => { // <-- ADD isLoggedIn HERE
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        $set: req.body.campground
    }, { new: true });
    req.flash("success", "successfully edited the campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Apply isLoggedIn to the delete route
router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => { // <-- ADD isLoggedIn HERE
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted campground!");
    res.redirect("/campgrounds");
}));

module.exports = router;