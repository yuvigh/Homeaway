const express = require("express");
const router = express.Router();

router.get("/",(req,res) => {
    res.send("Get for Posts");
});

//show
router.get("/:id",(req,res) => {
    res.send("Get for show Posts");
})

//Post
router.post("/",(req,res) => {
    res.send("POST for posts");
})


//DELETE
router.delete("/:id",(req,res) => {
    res.send("DELETE for posts");
});

module.exports = router;