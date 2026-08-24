const userModel = require("../models/user.model");
const { sendPushNotification } = require("../services/notificationService");

const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id; // Jisko follow karna hai
    const currentUserId = req.user.id; // Login user

    // Khud ko follow nahi kar sakte
    if (targetUserId === currentUserId) {
      return res.status(400).json({
        message: "You cannot follow yourself",
      });
    }

    // Dono users fetch karo
    const targetUser = await userModel.findById(targetUserId);
    const currentUser = await userModel.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already follow check
    if (targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({
        message: "Already following this user",
      });
    }

    // Follow
    targetUser.followers.push(currentUserId);
    currentUser.following.push(targetUserId);

    await targetUser.save();
    await currentUser.save();

    if (targetUser.pushToken) {
      sendPushNotification({
        pushToken: targetUser.pushToken,

        title: "New Follower",

        body: `${currentUser.name} just followed you`,

        data: {
          type: "follow",
          userId: currentUser._id.toString(),
        },
      }).catch((error) => {
        console.log(
          "❌ Follow Notification Error =>",
          error.response?.data || error.message,
        );
      });
    }

    return res.status(200).json({
      message: "User followed successfully",
      followers: targetUser.followers.length,
      following: currentUser.following.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    // Khud ko unfollow nahi kar sakte
    if (targetUserId === currentUserId) {
      return res.status(400).json({
        message: "You cannot unfollow yourself",
      });
    }

    const targetUser = await userModel.findById(targetUserId);
    const currentUser = await userModel.findById(currentUserId);

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!currentUser) {
      return res.status(404).json({
        message: "Current user not found",
      });
    }

    // Follow hi nahi kar raha
    if (!targetUser.followers.includes(currentUserId)) {
      return res.status(400).json({
        message: "You are not following this user",
      });
    }

    // Remove follower
    targetUser.followers.pull(currentUserId);

    // Remove following
    currentUser.following.pull(targetUserId);

    await targetUser.save();
    await currentUser.save();

    return res.status(200).json({
      message: "User unfollowed successfully",
      isFollowed: false,
      followers: targetUser.followers.length,
      following: currentUser.following.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .populate("followers", "name email");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      totalFollowers: user.followers.length,
      followers: user.followers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { search } = req.query;

    const query = {
      _id: { $ne: currentUserId },
    };

    // Search by name
    if (search && search.trim()) {
      query.name = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const users = await userModel
      .find(query)
      .select("name profileImage followers following");

    const data = users.map((user) => ({
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage,
      followers: user.followers.length,
      following: user.following.length,
      isFollowed: user.followers.some((id) => id.toString() === currentUserId),
    }));

    return res.status(200).json({
      totalUsers: data.length,
      users: data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
const getFollowing = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.id)
      .populate("following", "name profileImage");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      totalFollowing: user.following.length,
      following: user.following,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const savePushToken = async (req, res) => {
  try {
    const userId = req.user.id;
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({
        success: false,
        message: "Push token is required",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        pushToken,
      },
      {
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Push token saved successfully",
    });
  } catch (error) {
    console.log("Save Push Token Error =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getAllUsers,
  getFollowing,
  savePushToken,
};
