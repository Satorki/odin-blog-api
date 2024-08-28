const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET add post.
router.get("/post-add", async (req, res) => {
  try {
    // const deleteUsers = await prisma.user.deleteMany(
    //   {
    //     where: {
    //       name: "sk",
    //     },
    //   }
    // );
    const checkUsers = await prisma.user.findMany();
    const checkPosts = await prisma.post.findMany();
    console.log(checkUsers);
    console.log(checkPosts);
    res.render("post-add");
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
