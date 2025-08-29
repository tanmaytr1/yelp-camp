const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
};

module.exports.createCampground = async (req, res) => { // <-- ADD isLoggedIn HERE
    const { campground } = req.body;
    const newCampground = new Campground(campground);
    newCampground.author = req.user._id; // Set the author to the logged-in user
    await newCampground.save();
    req.flash("success", "successfully made a new campground!");
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }    
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds'); // Redirect to index page
    }
    // console.log(campground);
    res.render("campgrounds/show", { campground });
}

module.exports.renderEditFrom = async (req, res) => { // <-- ADD isLoggedIn HERE
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash("error","cannot find that campground");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => { 
    const { id } = req.params;
    // const campground = await Campground.findById(id);
    const campground = await Campground.findByIdAndUpdate(id, {
        $set: req.body.campground
    }, { new: true });
    req.flash("success", "successfully edited the campground!");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => { // <-- ADD isLoggedIn HERE
    const { id } = req.params;
    
    
    await Campground.findByIdAndDelete(id);
    req.flash("success", "successfully deleted campground!");
    res.redirect("/campgrounds");
}