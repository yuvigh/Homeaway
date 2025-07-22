const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter =  require("./routes/review.js");
const UserRouter = require("./routes/user.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const sessionOptions = {
  secret:"mysupersecretcode",
  resave:"false",
  saveUninitialized:true,
  cookie:{
    expires:Date.now() + 7 *24*60*60*1000,
    maxAge: 7 *24*60*60*1000,
    httpOnly:true,//prevent from crossScripting attacks
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  //console.log(success);
  next();
})


main().then((req,res) =>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


//Root Route
// app.get("/",(req,res) => {
//   res.send("hi,i am root")
// });

// app.get("/demouser",async(req,res) => {
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username:"DeltaStudent"
//   });

//   let registerUser = await User.register(fakeUser,"yuvi");
//   res.send(registerUser);
// });

//routes for listing
app.use("/listing",listingRouter);
//routes for reviews
app.use("/listing",reviewRouter);
//route for user
app.use("/",UserRouter);


app.all("*",(req,res,next) => {
    next(new ExpressError(404,"page Not Found"));
})


app.use((err,req,res,next) => {
  let{status=500,message="Something Went Wrong"} = err;
  //res.status(status).send(message);
  res.status(status).render("Error.ejs",{message})
});


app.listen(8080,() => {
    console.log("server is listening");
});