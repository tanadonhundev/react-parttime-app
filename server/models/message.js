const mongoose = require("mongoose");

const messageScheme = mongoose.Schema({
    chatId: String,
    senderId: String,
    text: String,
}, { timestamps: true });

module.exports = mongoose.model("Message", messageScheme);