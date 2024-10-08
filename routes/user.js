const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_ACCES_SECRET, (err, user) => {
    if (err) {
      req.user = null;
      return next();
    }
    req.user = user;
    next();
  });
}

// GET sign in.
router.get("/sign-in", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.render("sign-in", {
        user: null,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.render("sign-in", { user: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST sign in.
router.post("/sign-in", async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { name: name },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_ACCES_SECRET, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET sign up.
router.get("/sign-up", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.render("sign-up", {
        user: null,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.render("sign-up", { user: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST sign up.
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

// GET sign out.
router.get("/sign-out", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
