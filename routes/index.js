const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);
  


  if (token == null) {
    req.user = null;
    return next(); // Proceed without blocking
  }
  jwt.verify(token, process.env.JWT_ACCES_SECRET, (err, user) => {
    if (err) {
      req.user = null; // Invalid token
      return next(); // Proceed without blocking
    }
    req.user = user; // Valid token
    next();
  });
}

// GET home page.
router.get("/", authenticateToken, (req, res) => {
  console.log(req.user);

  res.render("index", { user: req.user });
});

module.exports = router;
