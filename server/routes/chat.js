const express = require("express");
const router = express.Router();

const { createChat, findUserChats, findChat } = require("../controllers/chat");

const { auth } = require("../middleware/auth");


router.post("/chats", createChat);

router.get("/chats/:userId", findUserChats);

router.get("/chats/find/:firstId/:secondId", findChat);

module.exports = router;