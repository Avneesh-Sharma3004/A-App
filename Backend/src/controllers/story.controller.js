const Story = require("../models/story.model");
const userModel = require("../models/user.model");
const uploadFile = require("../services/storage.service");

const createStory = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Media is required",
      });
    }

    // Upload to ImageKit
    const result = await uploadFile(req.file.buffer);

    // Detect image/video
    const type = req.file.mimetype.startsWith("video") ? "video" : "image";

    // Save story
    const story = await Story.create({
      user: req.user.id,
      media: result.url,
      type,
    });

    return res.status(201).json({
      message: "Story uploaded successfully",
      story,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getStories = async (req, res) => {
  try {
    const currentUser = await userModel.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const allowedUsers = [...currentUser.following, currentUser._id];
    const stories = await Story.find({
      expiresAt: { $gt: new Date() },
      user: { $in: allowedUsers },
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const groupedStories = {};

    stories.forEach((story) => {
      const userId = story.user._id.toString();

      if (!groupedStories[userId]) {
        groupedStories[userId] = {
          user: story.user,
          stories: [],
        };
      }

      const isViewed = story.viewers.some(
        (viewer) => viewer.user.toString() === req.user.id,
      );

      groupedStories[userId].stories.push({
        _id: story._id,
        media: story.media,
        type: story.type,
        createdAt: story.createdAt,
        isViewed,
      });
    });

    return res.status(200).json({
      success: true,
      data: Object.values(groupedStories),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const viewStory = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id);

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    // Story owner apni story dekhe to view count mat badhao
    if (story.user.toString() === req.user.id) {
      return res.status(200).json({
        message: "Own story viewed",
      });
    }

    // Check user already viewed or not
    const alreadyViewed = story.viewers.some(
      (viewer) => viewer.user.toString() === req.user.id,
    );

    if (!alreadyViewed) {
      story.viewers.push({
        user: req.user.id,
      });

      await story.save();
    }

    return res.status(200).json({
      message: "Story viewed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getStoryViewers = async (req, res) => {
  try {
    const { id } = req.params;

    const story = await Story.findById(id)
      .populate("viewers.user", "name email")
      .populate("user", "name");

    if (!story) {
      return res.status(404).json({
        message: "Story not found",
      });
    }

    // Sirf story owner hi viewers dekh sakta hai
    if (story.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not authorized to view story viewers",
      });
    }

    const viewers = story.viewers.map((viewer) => ({
      _id: viewer.user._id,
      name: viewer.user.name,
      email: viewer.user.email,
      viewedAt: viewer.viewedAt,
    }));

    return res.status(200).json({
      totalViews: viewers.length,
      viewers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createStory,
  getStories,
  viewStory,
  getStoryViewers,
};
