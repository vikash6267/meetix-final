const mongoose = require('mongoose');


const roomActivitySchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  messages: [
    {
      peer_name: String,
      peer_id: String,
      to_peer_id: String,
      to_peer_name: String,
      peer_msg: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  testmitting: { type: String, },
  subscriptions: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscriptions",
        required: true,
      },
      enrollmentDate: {
        type: Date,
        default: Date.now,
      },
      expirationDate: {
        type: Date,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      // razorpay_order_id: { // Add this field
      //   type: String,
      // },
      // razorpay_payment_id: { // Add this field
      //   type: String,
      // },
      transaction_id: { // Add this field
        type: String,
      },
      payable: { // Add this field
        type: Number,
      },
      expiryMail: {
        type: Number,
        default: 0
      },

    },
  ],

  isAdmin: {
    type: String,
    default: "false"
  },
  meetings: [
    {
      roomId: { type: String },
      joinedAt: { type: Date, default: Date.now }
    }
  ],
  upCommingMeetings: [
    {
      roomId: { type: String },
      meetingName: { type: String },
      scheduleDateTime: { type: Date, default: Date.now },
      isJoined: { type: Boolean, default: false },
      joinedAt: { type: Date, default: Date.now },
      shortSummary: { type: String },
      participants: [{ type: String, match: /.+\@.+\..+/ }],
      isCancelled: { type: Boolean, default: false } ,
      noti30min: { type: Boolean, default: false } ,
    }
  ]

  ,

  phone: { type: String },
company: { type: String },

  recordings: [
    {
      roomId: { type: String },
      url: { type: String },
      fileName: { type: String },
      size: { type: String },
      codecs: { type: String },
      device: { type: String },
      duration: { type: String }, // Optional: If you want recording duration
      storedType: { type: String, default: "Locally" },
      date: { type: Date, default: Date.now }
    }
  ],
  roomActivity: {
    type: [roomActivitySchema],
    default: []  // ✅ ensures it always exists
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
