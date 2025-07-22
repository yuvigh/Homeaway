const mongoose = require("mongoose");
const Schema =  mongoose.Schema;
const Review  = require("./review.js");

const listingSchema = new mongoose.Schema({
    title:
    {type:String,
      required:true  
    },
    description:String,
    image:{
        type:String,
        default:
            "https://unsplash.com/photos/a-single-leaf-on-a-twig-in-a-forest-913aM5bLFIg",
        set:(v) => v === ""?"https://unsplash.com/photos/a-single-leaf-on-a-twig-in-a-forest-913aM5bLFIg":v,
    },
    price:Number,
    location:String,
    country:String,
   reviews:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }
   ],
   owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
   },
});


listingSchema.post("findOneAndDelete",async (listings) => {
   if(listings)
   {
    await Review.deleteMany({_id : {$in: listings.reviews}})
   }
});


 const listing = mongoose.model("listing",listingSchema);
 module.exports = listing;