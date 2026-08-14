const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middlewere");
const {
  followUser,
  unfollowUser,
  getFollowers,
  getAllUsers,
  getFollowing,
  savePushToken,
} = require("../controllers/user.controller");

router.post("/:id/follow", auth, followUser);
router.post("/:id/unfollow", auth, unfollowUser);
router.get("/:id/followers", auth, getFollowers);
router.get("/all", auth, getAllUsers);
router.get("/:id/following", auth, getFollowing);
router.post("/push-token", auth, savePushToken);
module.exports = router;
