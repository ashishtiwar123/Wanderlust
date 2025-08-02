const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
const ejsMate = require("ejs-mate");



main().then( () => {
    console.log("connected to Db")
})
.catch((err) => {
 console.log(err);
});
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

}
app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get("/",(req, res) => {
    res.send("Hi im the main root");


});


app.get("/listing", async (req, res) => {
   const allListing = await Listing.find({});
   res.render("listing/index.ejs",{allListing});
});

app.get("/listings/new", (req, res) => {
    res.render("listing/new.ejs")
});

app.get("/listings/:id",async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs",{listing});
});

app.post("/listings", async (req, res) => {
    // let {title,description ,image,price,country,location} = req.body;
   const newListing = new Listing(req.body.listing);
   await newListing.save();
    res.redirect("/listing");
});


app.get("/listing/:id/edit", async (req,res) => {
     let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs",{ listing});
});
app.put("/listings/:id", async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
});


app.delete("/listings/:id" , async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
})


app.listen(8080, () => {
    console.log("appServer is listening to port 8080 ")
});