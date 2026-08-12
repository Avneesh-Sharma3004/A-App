const uploadfile = require("../services/storage.service");
const postModel = require("../models/post.model");

const createPost = async (req, res) => {
  try {
    const result = await uploadfile(req.file.buffer);

    const post = await postModel.create({
      image: result.url,
      caption: req.body.caption,
      user: req.user.id,
    });

    return res.status(201).json({
      message: "Upload successful",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await postModel.find();

    return res.status(200).json({
      message: "All Posts",
      data: posts,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const userId = req.user.id;

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    let liked = false;

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter((id) => id.toString() !== userId);

      liked = false;
    } else {
      // Like
      post.likes.push(userId);

      liked = true;
    }

    await post.save();

    return res.status(200).json({
      message: liked ? "Post liked successfully" : "Post unliked successfully",

      liked,
      totalLikes: post.likes.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getPostLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id).populate("likes", "name email");

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      totalLikes: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  deletePost,
  likePost,
  getPostLikes,
};
