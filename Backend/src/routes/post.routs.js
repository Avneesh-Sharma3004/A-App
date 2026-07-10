const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth.middlewere");

router.post("/create-post", upload.single("image"), postController.createPost);

router.get("/get-posts", auth, postController.getPosts);

module.exports = router;
