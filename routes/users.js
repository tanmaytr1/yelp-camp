const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CatchAsync = require("../utils/catchAsync"); // Import the catchAsync function

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", CatchAsync(async (req, res) => {
  try{
    const { username, email, password } = req.body; // Get user-inputted fields
  const user = new User({ username, email }); // Create a new user instance
  const registeredUser = await User.register(user, password); // Register the user with the provided password
    req.flash("success", "Successfully registered!"); // Flash success message
    res.redirect("/campgrounds"); // Redirect to the campgrounds page after registration
  }catch (error) {
    if (error.name === 'UserExistsError') {
            req.flash('error', 'A user with that username or email already exists.');
            
        } else {
            // For other unexpected errors, provide a generic message or log the specific error
            req.flash('error', 'Something went wrong during registration. Please try again.');
            console.error(error); // Log the detailed error for debugging
        }
    res.redirect("/register"); // Redirect back to the registration page
  }

}));

module.exports = router;
