const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
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

// GET add post.
router.get("/post-add", authenticateToken, async (req, res) => {
  try {
    // await prisma.user.deleteMany({
    //   where: {
    //     OR: [
    //       { name: "sk" },
    //       { name: "ss" },
    //     ],
    //   },
    // });
    const checkUsers = await prisma.user.findMany();
    const checkPosts = await prisma.post.findMany();
    console.log(checkUsers);
    console.log(checkPosts);

    res.render("post-add", {
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong");
  }
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
