const mongoose = require("mongoose");
const initData = require("./data.js");
const listing = require("../models/listing.js");



main().then((req,res) =>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const initDB = async () => {
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj,owner:"672b631fd8822ac60775ea0e"}));
    await listing.insertMany(initData.data);
    console.log("data was initialized")
};
initDB();