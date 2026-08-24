const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middlewere");

const { testNotification } = require("../controllers/notification.controller");

router.post("/test-notification", authMiddleware, testNotification);

module.exports = router;
