const express = require("express");
const router = express.Router();
const {
  addUpcomingMeeting,
  getUpcomingMeetings,
  updateUpcomingMeeting,
  deleteUpcomingMeeting,
  getRoomDetails,
  getUserMeetingsDetails,
  sendMeetingInvite,
} = require("../controllers/userCtrl");
const User = require("../models/User");
const { sendOtp, verifyOtp } = require("../controllers/otpCtrl");
const jwt = require('jsonwebtoken');

// 🔹 Add an upcoming meeting
router.post("/create/:userId", addUpcomingMeeting);

// 🔹 Get all upcoming meetings
router.get("/getAll/:userId", getUpcomingMeetings);

// 🔹 Update a meeting
router.put("/upcoming-meetings/:userId/:meetingId", updateUpcomingMeeting);

// 🔹 Delete a meeting
router.delete("/delete/:userId/:meetingId", deleteUpcomingMeeting);



router.get('/room-details/:roomId', getRoomDetails);
router.get('/user-meetings/:userId', getUserMeetingsDetails);
router.post('/send-meeting-invite', sendMeetingInvite);





router.post("/testmeeting", async (req, res) => {
  try {
    const { roomId, testmittingValue } = req.body;

    if (!roomId || !testmittingValue) {
      return res.status(400).json({
        success: false,
        message: "roomId and testmittingValue are required.",
      });
    }

    // Find user by meeting roomId and populate subscription.service
    const user = await User.findOne({ "meetings.roomId": roomId }).populate("subscriptions.service");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with given meeting not found.",
      });
    }

    // Update testmitting field
    user.testmitting = testmittingValue;
    await user.save();

    // Check for valid (not expired + active) subscription
    const now = new Date();
    const validSubscription = user.subscriptions.find(sub => {
      return (
        sub.isActive &&
        (!sub.expirationDate || new Date(sub.expirationDate) > now)
      );
    });

    res.status(200).json({
      success: true,
      message: "testmitting updated successfully.",
      isSubscription: !!validSubscription, // true or false
      subscription: validSubscription || null,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        testmitting: user.testmitting,
      },
    });
  } catch (err) {
    console.error("Error in /testmeeting:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/save-recording", async (req, res) => {
  try {
    const { roomId, url, fileName, size, codecs, device, storedType, duration } = req.body;

    if (!roomId || !url) {
      return res.status(400).json({ success: false, message: "roomId and url are required." });
    }

    const user = await User.findOne({ "meetings.roomId": roomId });

    if (!user) {
      return res.status(404).json({ success: false, message: "User with given roomId not found." });
    }

    // Push new recording with all metadata
    user.recordings.push({
      roomId,
      url,
      fileName,
      size,
      codecs,
      device,
      storedType: storedType || "Locally",
      duration
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Recording and metadata saved successfully.",
      recordings: user.recordings
    });
  } catch (err) {
    console.error("Error saving recording:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});




router.get("/recordings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ success: false, message: "userId is required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Recordings fetched successfully",
      recordings: user.recordings || [],
    });
  } catch (err) {
    console.error("Error fetching recordings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post('/messagePush', async (req, res) => {
  const {
    room_id,
    peer_name,
    peer_id,
    to_peer_id,
    to_peer_name,
    peer_msg
  } = req.body;
console.log("req.body",req.body)
  try {
    // Find all users who joined this room
    const users = await User.find({ 'meetings.roomId': room_id });

    if (!users.length) return res.status(404).json({ message: 'No users found in this room' });

    // Message object
    const messageObj = {
      peer_name,
      peer_id,
      to_peer_id,
      to_peer_name,
      peer_msg,
      timestamp: new Date()
    };

    // For each user, add message to roomActivity
    const updates = users.map(async user => {
      const existingRoom = user.roomActivity.find(r => r.roomId === room_id);

      if (existingRoom) {
        existingRoom.messages.push(messageObj);
      } else {
        user.roomActivity.push({
          roomId: room_id,
          messages: [messageObj]
        });
      }

      await user.save();
    });

    await Promise.all(updates);

    res.status(200).json({ message: 'Message pushed to all users in the room.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});






router.get('/room-activity/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select('roomActivity');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room activity fetched successfully',
      roomActivity: user.roomActivity
    });
  } catch (error) {
    console.error('Error fetching room activity:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching room activity'
    });
  }
});



router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);



router.post('/generate-token', (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({ token });
});


module.exports = router;
