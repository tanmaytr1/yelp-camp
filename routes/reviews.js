const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync"); // Import the catchAsync function
const Campground = require("../models/campground");
const Review = require("../models/review");
const isLoggedIn = require("../middleware/isLoggedIn");

router.post("/", isLoggedIn,catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review); // Create a new review instance
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save(); // Save the review to the database
  await campground.save(); // Save the campground with the new review reference
  res.redirect(`/campgrounds/${campground._id}`);
}));  

router.delete("/:reviewId",catchAsync(async(req,res)=>{
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference from campground
  await Review.findByIdAndDelete(reviewId); // Delete the review document from the database
  res.redirect(`/campgrounds/${id}`); // Redirect to the campground's show page
}));

module.exports = router;