
const express = require("express");
const postRoutes = require ("./routes/post.routs")
const authRoutes = require("./routes/auth.routes")

const app = express();

app.use(express.json());


app.use("/posts", postRoutes);
app.use("/api/auth",authRoutes)


module.exports = app;