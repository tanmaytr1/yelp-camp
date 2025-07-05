const Campground = require("../models/campground");

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Fetch it here for the middleware
    if (!campground) {
        req.flash("error", "Cannot find that campground!");
        return res.redirect("/campgrounds");
    }
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You are not permitted to do this");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports = isAuthor;