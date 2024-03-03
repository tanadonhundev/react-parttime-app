const mongoose = require("mongoose");

const chatScheme = mongoose.Schema({
    members: Array,
}, { timestamps: true });

module.exports = mongoose.model("Chat", chatScheme);