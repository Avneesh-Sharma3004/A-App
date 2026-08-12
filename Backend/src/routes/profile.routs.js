const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middlewere");
const { getProfile } = require("../controllers/profile.controller");

router.get("/profile", auth, getProfile);

module.exports = router;
