const express = require("express");
const router = express.Router();
const { unreadMessage, FindUnreadMessage } = require("../controllers/unreadMessages");

router.post("/unreadMessages", unreadMessage);

router.get("/unreadMessages/:userId", FindUnreadMessage);

module.exports = router;