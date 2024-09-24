const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
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

// GET add post.
router.get("/post-add", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.render("post-add", {
        user: null,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.render("post-add", { user: user.name });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add post.
router.post("/create", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const post = await prisma.post.create({
      data: {
        title: req.body.title,
        content: req.body.content,
        authorId: user.id,
      },
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET edit post.
router.get("/post-edit/:id", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });

    res.render("post-edit", { user: user.name, post: post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST edit post.
router.post("/post-edit/:id", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.render("index", {
        user: null,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });

    if (!user.isAdmin && post.authorId !== user.id) {
      return res.status(404).json({ error: "User not permitted" });
    }

    const postUpdate = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: {
        title: req.body.title,
        content: req.body.content,
      },
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST delete post.
router.post("/post-delete/:id", authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.render("index", {
        user: null,
      });
    }
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const post = await prisma.post.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!user.isAdmin && post.authorId !== user.id) {
      return res.status(404).json({ error: "User not permitted" });
    }
    const postDelete = await prisma.post.delete({
      where: { id: Number(req.params.id) },
    });
    res.redirect("/");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
