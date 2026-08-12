const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middlewere");
const upload = require("../middlewares/upload.middleware");

const { createStory } = require("../controllers/story.controller");
const { getStories } = require("../controllers/story.controller");
const { viewStory } = require("../controllers/story.controller");
const { getStoryViewers } = require("../controllers/story.controller");

router.post("/", auth, upload.single("media"), createStory);
router.get("/", auth, getStories);
router.post("/:id/view", auth, viewStory);
router.get("/:id/viewers", auth, getStoryViewers);

module.exports = router;
