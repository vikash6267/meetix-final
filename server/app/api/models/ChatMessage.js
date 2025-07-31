const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    roomId: String,
    senderName: String,
    senderId: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
