const express = require("express");
const router = express.Router();

const {
  sendMessage,
  getConversationMessages,
  markMessagesAsRead,
} = require("../controllers/message.controller");

const authMiddleware = require("../middlewares/auth.middlewere");

router.post("/send", authMiddleware, sendMessage);
router.get("/:userId", authMiddleware, getConversationMessages);
router.patch("/:userId/read", authMiddleware, markMessagesAsRead);

module.exports = router;
