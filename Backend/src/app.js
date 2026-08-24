const express = require("express");
const postRoutes = require("./routes/post.routs");
const authRoutes = require("./routes/auth.routes");
const profileRoutes = require("./routes/profile.routs");
const storyModel = require("./models/story.model");
const storyRoutes = require("./routes/story.routes");
const userRoutes = require("./routes/user.routes");
const messageRoutes = require("./routes/message.route");
const notificationRoutes = require("./routes/notification.routes");

const app = express();

app.use(express.json());

app.use("/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notifications", notificationRoutes);

module.exports = app;
