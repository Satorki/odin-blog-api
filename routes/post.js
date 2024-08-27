const express = require("express");
const router = express.Router();

// GET add post.
router.get("/post-add", (req, res) => {
    res.render("post-add");
});

// POST add post.
router.post("/post-add", (req, res) => {
    res.redirect("/");
});

// GET edit post.
router.get("/post-edit", (req, res) => {
    res.render("post-edit");
});

// POST edit post.
router.post("/post-edit", (req, res) => {
    res.redirect("/");
});

module.exports = router