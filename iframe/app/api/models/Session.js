const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: String,         
  sessionName: String,          
  hostName: String,
  hostEmail: String,   
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  duration: String,             
  totalAttendees: Number
});

module.exports = mongoose.model('Session', sessionSchema);
