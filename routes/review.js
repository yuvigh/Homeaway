const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");


const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
      let errmsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errmsg);
    }
    else{
      next();
    }
  };


//Reviews
//Post Route
router.post("/:id/reviews",isLoggedIn,validateReview,wrapAsync(async(req,res) => {
     
    let listings = await listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
    listings.reviews.push(newReview);
  
   await newReview.save();
   await listings.save();
  req.flash("success","New Review Created");
   res.redirect(`/listing/${listings._id}`);
  }));
  
  //Delete Route
 router.delete("/:id/reviews/:reviewid",isReviewAuthor,isLoggedIn,wrapAsync(async(req,res) => {
  
      let {id,reviewid} = req.params;
      await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
      await Review.findByIdAndDelete(reviewid);
      req.flash("success"," Review Deleted");
      res.redirect(`/listing/${id}`);
  }));

  module.exports = router;
  