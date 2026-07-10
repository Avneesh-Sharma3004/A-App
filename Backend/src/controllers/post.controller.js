const uploadfile = require("../services/storage.service");
const postModel = require("../models/post.model");

const createPost = async (req, res) => {
  try {
    const result = await uploadfile(req.file.buffer);

    const post = await postModel.create({
      image: result.url,
      caption: req.body.caption,
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

module.exports = {
  createPost,
  getPosts,
};