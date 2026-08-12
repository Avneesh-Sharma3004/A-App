const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload.middleware");
const postController = require("../controllers/post.controller");
const auth = require("../middlewares/auth.middlewere");
const {
  addComment,
  getComments,
  deleteComment,
} = require("../controllers/comment.controller");

router.post(
  "/create-post",
  upload.single("image"),
  auth,
  postController.createPost,
);

router.get("/get-posts", auth, postController.getPosts);
router.delete("/delete-post/:id", auth, postController.deletePost);
router.post("/:id/like", auth, postController.likePost);
router.get("/:id/like", auth, postController.getPostLikes);

router.post("/:id/comments", auth, addComment);
router.get("/:id/comments", auth, getComments);
router.delete("/comments/:id", auth, deleteComment);

module.exports = router;
