const express = require("express");
const app = express();
const path = require("path"); // Import path
const mongoose = require("mongoose");
const Campground = require("./models/campground"); // Import the model
const catchAsync = require("./utils/catchAsync"); // Import the catchAsync function
// const ExpressError = require("./utils/ExpressError"); // Import the expressError function
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const Review = require("./models/review");
const campgrounds = require("./routes/campground");
const reviews = require("./routes/reviews");
const session = require("express-session");

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

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
};
app.use(session(sessionConfig));

// Routes
app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.use("/campgrounds",campgrounds);
app.use("/campgrounds/:id/reviews",reviews);





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
