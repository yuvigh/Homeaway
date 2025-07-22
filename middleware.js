const listing = require("./models/listing.js");
const Review = require("./models/review.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated())
        {
          //redirectUrl save
          req.session.redirectUrl = req.originalUrl;
          req.flash("error","you must be logged in to create listing!");
          return res.redirect("/login");
        }
        next();
};

module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async(req,res,next) => {
  let {id}  = req.params;
  let Listing =await listing.findById(id);
  if(!Listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listing/${id}`);
  }
  next();
}


module.exports.isReviewAuthor = async(req,res,next) => {
  let {id,reviewid}  = req.params;
  let review =await Review.findById(reviewid);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
}