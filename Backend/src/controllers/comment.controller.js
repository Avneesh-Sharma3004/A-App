const commentModel = require("../models/comment.model");
const postModel = require("../models/post.model");

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Comment empty na ho
    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    // Post exist karti hai ya nahi
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Comment create
    const comment = await commentModel.create({
      post: id,
      user: req.user.id,
      text,
    });

    // User details ke sath response
    await comment.populate("user", "name");

    return res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getComments = async (req, res) => {
  try {
    const { id } = req.params;

    // Post exist karti hai ya nahi
    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    // Comments fetch
    const comments = await commentModel
      .find({ post: id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      totalComments: comments.length,
      comments,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Comment find
    const comment = await commentModel.findById(id);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    // Post find
    const post = await postModel.findById(comment.post);

    // Permission Check
    const isCommentOwner = comment.user.toString() === req.user.id;

    const isPostOwner = post.user.toString() === req.user.id;

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }

    await comment.deleteOne();

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
module.exports = {
  addComment,
  getComments,
  deleteComment,
};
