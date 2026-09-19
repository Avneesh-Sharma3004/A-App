const uploadfile = require("../services/storage.service");
const Reel = require("../models/reel.model");

const createReel = async (req, res) => {
  try {
    // Video check
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Reel video is required",
      });
    }

    // File type check
    if (!req.file.mimetype.startsWith("video/")) {
      return res.status(400).json({
        success: false,
        message: "Only video files are allowed",
      });
    }

    // Upload video to ImageKit
    const result = await uploadfile(req.file.buffer, req.file.originalname);

    // Save reel in MongoDB
    const reel = await Reel.create({
      video: result.url,
      caption: req.body.caption || "",
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Reel uploaded successfully",
      data: reel,
    });
  } catch (error) {
    console.log("Create Reel Error =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReels = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const reels = await Reel.aggregate([
      // 1️⃣ Random reels
      {
        $sample: {
          size: 20,
        },
      },

      // 2️⃣ User collection ke saath join
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      // 3️⃣ user array ko object banao
      {
        $unwind: "$user",
      },

      // 4️⃣ Sirf required user fields
      {
        $project: {
          video: 1,
          thumbnail: 1,
          caption: 1,
          likes: 1,
          commentsCount: 1,
          sharesCount: 1,
          createdAt: 1,

          user: {
            _id: "$user._id",
            name: "$user.name",
            profileImage: "$user.profileImage",
          },
        },
      },
    ]);

    // Current user ne like kiya hai ya nahi
    const formattedReels = reels.map((reel) => ({
      ...reel,

      totalLikes: reel.likes?.length || 0,

      isLiked: reel.likes?.some(
        (id) => id.toString() === currentUserId.toString(),
      ),

      // Frontend ko complete likes array ki zarurat nahi
      likes: undefined,
    }));

    return res.status(200).json({
      success: true,
      count: formattedReels.length,
      data: formattedReels,
    });
  } catch (error) {
    console.log("Get Reels Error =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const likeReel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reel = await Reel.findById(id);

    if (!reel) {
      return res.status(404).json({
        success: false,
        message: "Reel not found",
      });
    }

    const alreadyLiked = reel.likes.some(
      (likeId) => likeId.toString() === userId.toString(),
    );

    let liked;

    if (alreadyLiked) {
      // Unlike
      reel.likes = reel.likes.filter(
        (likeId) => likeId.toString() !== userId.toString(),
      );

      liked = false;
    } else {
      // Like
      reel.likes.push(userId);

      liked = true;
    }

    await reel.save();

    return res.status(200).json({
      success: true,
      message: liked ? "Reel liked successfully" : "Reel unliked successfully",
      liked,
      totalLikes: reel.likes.length,
    });
  } catch (error) {
    console.log("Like Reel Error =>", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReel,
  getReels,
  likeReel,
};
