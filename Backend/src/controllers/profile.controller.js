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

const getSingleUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const user = await userModel
      .findById(userId)
      .select("-password")
      .populate("followers", "name profileImage")
      .populate("following", "name profileImage");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const posts = await postModel
      .find({
        user: userId,
      })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    const isFollowed = user.followers.some(
      (follower) => follower._id.toString() === currentUserId.toString(),
    );

    return res.status(200).json({
      success: true,

      user: {
        _id: user._id,
        name: user.name,
        profileImage: user.profileImage,
        followers: user.followers,
        following: user.following,
        followersCount: user.followers.length,
        followingCount: user.following.length,
      },

      posts,
      isFollowed,
    });
  } catch (error) {
    console.log("Get Single Profile Error =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getProfile, getSingleUserProfile };
