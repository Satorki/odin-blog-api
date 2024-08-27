const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
    await prisma.user.create({
      data: {
        name: req.body.name,
        password: req.body.password,
      },
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
