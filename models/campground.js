const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  image: String,
  location: String,
  author:{
    type: Schema.Types.ObjectId,
    ref: "User" // Reference to the User model
  },
  reviews :[
    {
      type: Schema.Types.ObjectId,
      ref: "Review" 
    }
  ]
});

CampgroundSchema.post("findOneAndDelete",async function(doc){
  if(doc && doc.reviews.length > 0){
    await Review.deleteMany({
      _id:{
        $in: doc.reviews
      }
    })
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);