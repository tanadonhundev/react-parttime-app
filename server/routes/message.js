const express = require("express");
const router = express.Router();

const { createMessage,getMessage } = require("../controllers/message");

const { auth } = require("../middleware/auth");


router.post("/message", createMessage);

router.get("/message/:chatId", getMessage);

module.exports = router;