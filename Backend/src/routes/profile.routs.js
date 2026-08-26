const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middlewere");
const {
  getProfile,
  getSingleUserProfile,
} = require("../controllers/profile.controller");

router.get("/profile", auth, getProfile);
router.get("/profile/:userId", auth, getSingleUserProfile);

module.exports = router;
