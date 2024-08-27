const express = require("express");
const router = express.Router();

// GET sing in.
router.get("/sign-in", (req, res) => {
  res.render("sign-in");
});

// POST sing in.
router.post("/sign-in", (req, res) => {
  res.redirect("/");
});

// GET sing up.
router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

// POST sing up.
router.post("/sign-up", (req, res) => {
  res.redirect("/");
});

module.exports = router;
