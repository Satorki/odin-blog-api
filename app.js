// express start
const express = require("express");
const app = express();

// dotenv start
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middleware start
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ejs start
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// routes start
const mainRoute = require("./routes/index");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
app.use("/", mainRoute);
app.use("/user", userRoute);
app.use("/post", postRoute);

// app start
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));