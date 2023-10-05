const mongoose = require("mongoose");
const placeschema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    description : String,
    image :{
        type: String,
        default: "https://plus.unsplash.com/premium_photo-1661913412680-c274b6fea096?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80",
        set : (v) =>
            v ==="" ? "https://plus.unsplash.com/premium_photo-1661913412680-c274b6fea096?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1931&q=80"
        :v
    },
    price : Number,
    location : String,
    country : String,
});

const PLACE = mongoose.model("PLACE", placeschema) 
module.exports = PLACE;