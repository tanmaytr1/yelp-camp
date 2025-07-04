const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
    username: { // <--- Add this field
        type: String,
        required: true,
        unique: true // <--- Make it unique
    },
    email:{
        type: String,
        required : true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);