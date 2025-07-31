const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
    roomId: String,
    peerName: String,
    peerId: String,
    joinTime: Date,
    leaveTime: Date,
    isHost: { type: Boolean, default: false }
});

module.exports = mongoose.model('Attendee', attendeeSchema);
