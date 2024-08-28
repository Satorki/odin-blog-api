const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

require("dotenv").config();
const adminCode = process.env.ADMINCODE;

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
router.post("/sign-up", async (req, res) => {
  try {
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
