const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

function authenticateToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    req.user = null;
    return next(); // Brak tokena, przejście dalej
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

// GET home page.
router.get("/", authenticateToken, async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
      },
    });
    if (!req.user) {
      return res.render("index", {
        user: null,
        posts: posts,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.render("index", {
      user: user.name,
      posts: posts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
