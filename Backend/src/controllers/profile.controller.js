const userModel = require("../models/user.model");
const postModel = require("../models/post.model");

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = await postModel
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      user,
      postCount: posts.length,
      followers: user.followers.length,
      following: user.following.length,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { getProfile };
