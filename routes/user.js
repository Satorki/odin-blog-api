const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    req.user = null; // User is not logged in
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


// GET sing in.
router.get("/sign-in", authenticateToken, (req, res) => {
  res.render("sign-in", { user: req.user });
});

// POST sing in.
router.post("/sign-in", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        name: req.body.userName,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

  //const accessToken = jwt.sign({ id: user.id }, process.env.JWT_ACCES_SECRET);

  // res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

// GET sing up.
router.get("/sign-up", (req, res) => {
  res.render("sign-up");
});

// POST sing up.
router.post("/sign-up", async (req, res) => {
  try {
    const adminCode = process.env.ADMINCODE;
    const userExists = await prisma.user.findUnique({
      where: {
        name: req.body.userName,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }
    await prisma.user.create({
      data: {
        name: req.body.userName,
        isAdmin: req.body.adminCode === adminCode ? true : false,
        password: await bcrypt.hash(req.body.password, 10),
      },
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
