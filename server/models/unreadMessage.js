const mongoose = require('mongoose');

const unreadMessageSchema = new mongoose.Schema({
  chatId: { type: String, required: true },
  userId: { type: String, required: true },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('UnreadMessage', unreadMessageSchema);
