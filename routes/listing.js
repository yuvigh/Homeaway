const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const listing = require("../models/listing.js");
const session = require("express-session");
const flash = require("connect-flash");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js")
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const listingController = require("../controllers/listing.js");


const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
    else{
      next();
    }
  }


//index route
router.get("/",wrapAsync(listingController.index))


 //new route
 router.get("/new",isLoggedIn,(req,res) => {
  console.log(req.user);

     res.render("./listing/new.ejs");
 })
 
 
 //show route
 router.get("/:id",isLoggedIn,async(req,res) => {
     let {id} = req.params;
    const listing1 = await listing.findById(id).
    populate({path:"reviews",populate:{
      path:"author",
    },
  })
  .populate("owner");
    if(!listing1){
      req.flash("error","Listing you requested for does not exist");
      return res.redirect("/listing");
    }
    console.log(listing1);
    res.render("./listing/show.ejs",{listing1});
 })
 
//Create Route
router.post("/",isLoggedIn,wrapAsync(async (req,res,next) =>{
    const newlisting = new listing(req.body.listing);
    newlisting.owner = req.user._id; 
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
  
  }));
  
  
  
  //edit route
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res) => {
      let{id} = req.params;
      const list = await listing.findById(id);
      if(!list){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listing");
      }
      res.render("./listing/edit.ejs",{list});
  }))
  
  
  
  //update Route
  router.put("/:id",isLoggedIn,isOwner,
    validateListing,
    wrapAsync(async(req,res) => {
  let {id} = req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listing/${id}`);
  }))
  
  
  
  //Delete Route
  router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req,res) => {
      let {id} = req.params;
      let deleteListing = await listing.findByIdAndDelete(id);
      console.log(deleteListing);
      req.flash("success","Listing Deleted");
      res.redirect("/listing");
  }));

  module.exports = router;
  
   