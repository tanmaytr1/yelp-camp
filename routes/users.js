const express = require("express");
const router = express.Router();
const User = require("../models/user");
const CatchAsync = require("../utils/catchAsync"); // Import the catchAsync function
const passport = require("passport");


router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", CatchAsync(async (req, res) => {
  try{
    const { username, email, password } = req.body; // Get user-inputted fields
    const user = new User({ username, email }); // Create a new user instance
    const registeredUser = await User.register(user, password); // Register the user with the provided password
    req.login(registeredUser, (err) => { // Log in the user after registration
      if (err) {
        console.error("Login error after registration:", err);
        req.flash("error", "Something went wrong during login. Please try again.");
        return res.redirect("/register");
      }
      req.flash("success", "Successfully registered!"); // Flash success message
    res.redirect("/campgrounds"); // Redirect to the campgrounds page after registration
    });
    
  
} catch (error) {
    console.error("Registration error:", error);

    
        if (error.name === 'UserExistsError') {
            req.flash('error', 'A user with that username already exists.');
        } else if (error.code === 11000 && error.message.includes('email')) {
            req.flash('error', 'A user with that email address already exists.');
        } else {
            req.flash('error', 'Something went wrong during registration. Please try again.');
        }
        res.redirect("/register");
    }
}));

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),(req, res, next) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds");
});

router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.redirect("/campgrounds");
        }
        req.flash("success", "Logged out successfully!");
        res.redirect("/campgrounds");
    });
});


module.exports = router;
