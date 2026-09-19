const express = require("express");
const multer = require("multer");

const {
  createReel,
  getReels,
  likeReel,
} = require("../controllers/reel.controller");

const authMiddleware = require("../middlewares/auth.middlewere");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
});

router.post("/", authMiddleware, upload.single("video"), createReel);
router.get("/", authMiddleware, getReels);
router.post("/:id/like", authMiddleware, likeReel);

module.exports = router;
