const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const isLoggedIn = require("../middleware/isLoggedIn"); // Import the isLoggedIn middleware
const isAuthor = require("../middleware/isAuthor");
const campgrounds = require("../controllers/campgrounds");

router.get("/", catchAsync(campgrounds.index));



// Apply isLoggedIn to the GET route for new campground form
router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

// Apply isLoggedIn to the POST route for creating a new campground
router.post("/", isLoggedIn, catchAsync(campgrounds.createCampground));

router.get("/:id", catchAsync(campgrounds.showCampground));

// Apply isLoggedIn to the edit routes
router.get("/:id/edit", isLoggedIn, isAuthor,catchAsync(campgrounds.renderEditFrom));

router.put("/:id", isLoggedIn, isAuthor,catchAsync(campgrounds.updateCampground));

// Apply isLoggedIn to the delete route
router.delete("/:id", isLoggedIn,isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;