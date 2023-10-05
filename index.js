const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PLACE = require("./model/schema.js");
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utills/wrapAsync.js")
const ExpError = require("./utills/ExpressError.js")
const { listingSchema } = require("./joiSchema.js")

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "public")));

main()
.then((res) => {console.log("connected to DB")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

app.listen("8080" , () =>{
    console.log("listening to port 8080");
});

// HANDLING SERVER SIDE VALIDATION ERROR WITH joi
const validateSchema = (req, res, next) => {
    const {error} =  listingSchema.validate(req.body);
    if(error){
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpError(400, errMsg)
    }else{ next() }
} 

app.get("/", (req,res) =>{
    res.redirect("/listings")
})

// Index Route
app.get("/listings",wrapAsync( async (req,res) =>{
    const allListing = await PLACE.find();
    res.render("listing/index.ejs", {allListing})
})
);

// Create Route 
app.get("/listings/new" , (req,res) =>{
    res.render("listing/addplace.ejs")
})

// Add Route
app.post("/listings", validateSchema ,wrapAsync(async (req,res,next) =>{
    // destructuring data from listing object
    let listing = req.body.listing;
    // console.log(listing);
    const newlisting = new PLACE(listing)
    await newlisting.save();
    res.redirect("/listings");
 })
)

// Show Route
app.get("/listings/:id", wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let key = await PLACE.findById(id);
    // console.log(key)
    res.render("listing/show.ejs", {key})
})
);

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res) =>{
    let {id} = req.params;
    let key = await PLACE.findById(id);
    // console.log(key)
    res.render("listing/edit.ejs", {key})
})
);

//Update Route
app.put("/listings/:id",validateSchema, wrapAsync(async (req,res) =>{
    let {id} = req.params;
    // destructuring body content then update
    let key = await PLACE.findByIdAndUpdate(id, {...req.body.listing})
    // console.log(key);
    res.redirect(`/listings/${id}`)
})
);
// Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let delplace = await PLACE.findByIdAndDelete(id);
    // console.log(delplace);
    res.redirect("/listings")
})
);

app.all("*", (req,res,next) =>{
    next(new ExpError(404, "Page not found"));
})

// Error Handling Middleware
app.use((err,req,res,next) => {
    let { statusCode=500, message="Something Went Wrong" } = err;
    res.status(statusCode).render("error.ejs", {message})
});