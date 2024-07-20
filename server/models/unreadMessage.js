const mongoose = require('mongoose');

const unreadMessageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  count: { type: Number, default: 0 },
});

module.exports = mongoose.model('UnreadMessage', unreadMessageSchema);
