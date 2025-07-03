const express = require("express");
const app = express();
const path = require("path"); // Import path
const mongoose = require("mongoose");
const Campground = require("./models/campground"); // Import the model
const catchAsync = require("./utils/catchAsync"); // Import the catchAsync function
const ExpressError = require("./utils/ExpressError"); // Import the expressError function
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const Review = require("./models/review");

// app.use(morgan("dev"));
// app.use((req, res, next) => {
//   console.log(req.method, req.path);
//   next();
// });

mongoose
  .connect("mongodb://localhost:27017/yelp-camp") // Returns a promise
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.engine("ejs", ejsMate); // Set the view engine
app.set("view engine", "ejs"); // Set the view engine
app.set("views", path.join(__dirname, "views")); // Set the views directory

app.use(express.urlencoded({ extended: true })); // Middleware to parse the body of the request
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", catchAsync (async (req, res) => {
  const { campground } = req.body; // Get user-inputted fields
  const newCampground = new Campground(campground);

  await newCampground.save();
  res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id).populate('reviews'); // Populate reviews to get review details
  console.log(campground);
  res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
}));

app.post("/campgrounds/:id/reviews", catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review); // Create a new review instance
  campground.reviews.push(review);
  await review.save(); // Save the review to the database
  await campground.save(); // Save the campground with the new review reference
  res.redirect(`/campgrounds/${campground._id}`);
}));  

app.delete("/campgrounds/:id/reviews/:reviewId",catchAsync(async(req,res)=>{
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove review reference from campground
  await Review.findByIdAndDelete(reviewId); // Delete the review document from the database
  res.redirect(`/campgrounds/${id}`); // Redirect to the campground's show page
}))

app.put("/campgrounds/:id",catchAsync( async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { 
    $set: req.body.campground // Only updates submitted fields
  }, { new: true }); // Returns updated document

  res.redirect(`/campgrounds/${campground._id}`);
}));



app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id); // Correct method for deleting a document by its ID
  // Optionally, if you have associated reviews, you'd handle them here too
  // e.g., await Review.deleteMany({ _id: { $in: campground.reviews }}); // if you decide to delete reviews when campground is deleted

  res.redirect("/campgrounds"); // Redirect to the campgrounds index page after deletion
}));


app.all(" * ", (req, res) => {
  res.render("404.ejs");
});

app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack trace to the console
  res.status(500).send("Something broke!"); // Send a generic error message to the client
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
