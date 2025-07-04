const isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER:", req.user);
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // Store the original URL to redirect after login
        req.flash("error", "You must be logged in to do that!");
        return res.redirect("/login");
    }
    next();
};

module.exports = isLoggedIn;