const mongoose = require("mongoose");

const reelSchema = new mongoose.Schema(
  {
    video: {
      type: String,
      required: true,
    },

    thumbnail: {
      type: String,
      default: null,
    },

    caption: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    commentsCount: {
      type: Number,
      default: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Reel", reelSchema);
