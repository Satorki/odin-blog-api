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
    // await prisma.user.deleteMany({
    //   where: {
    //     OR: [
    //       { name: "sk" },
    //       { name: "ss" },
    //     ],
    //   },
    // });
    // const checkUsers = await prisma.user.findMany();
    // const checkPosts = await prisma.post.findMany();
    // console.log(checkUsers);
    // console.log(checkPosts);

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

module.exports = router;
