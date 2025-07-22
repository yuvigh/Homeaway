const listing = require("../models/listing.js");

module.exports.index = async (req,res) => {
    const allListing = await  listing.find({});
    res.render("./listing/index.ejs",{allListing});
 }

 module.exports.render = (req,res) => {
    console.log(req.user);
  
       res.render("./listing/new.ejs");
   }
 