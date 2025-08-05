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
  checkIfUserJoinedMeeting,
  updateProfile,
  getProfile,
} = require("../controllers/userCtrl");
const User = require("../models/User");
const { sendOtp, verifyOtp, resetPassword } = require("../controllers/otpCtrl");
const bcrypt = require('bcrypt');
const OTP = require("../models/OTP");
const { OpenAI } = require('openai');





const openai = new OpenAI({ apiKey: process.env.CHATGPT_API_KEY});

router.post('/translate-text', async (req, res) => {
    const { text, targetLang } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: `Translate the following text to ${targetLang}.` },
                { role: "user", content: text }
            ],
            temperature: 0.3,
        });

        const translatedText = response.choices[0].message.content;
        res.json({ translatedText });
    } catch (err) {
        console.error('Translation error:', err.message);
        res.status(500).json({ error: 'Translation failed' });
    }
});


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
router.patch("/reset-password", resetPassword);





const jwt = require('jsonwebtoken');
const mailSender = require("../helper/mailsender");

router.post('/generate-token', (req, res) => {
  const { userId } = req.body;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({ token });
});










// POST /change-password
router.post('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Compare current password with stored hash
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect.' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Save new password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('Password Change Error:', err);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});
// POST /user/api/v1/set-role
router.post("/set-role", async (req, res) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).json({ message: "User ID and role are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = role === "admin" ? "true" : "false";
    await user.save();

    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error("Set Role Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});









router.post("/request-role-change-otp", async (req, res) => {
  const { email, userId, role } = req.body;

  if (!email || !userId || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const admin = await User.findOne({ email, isAdmin: "true" });
    if (!admin) {
      return res.status(403).json({ message: "Only a valid admin can perform this action." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: Date.now() },
      { upsert: true }
    );

    const htmlBody = `
      <p>Dear Admin,</p>
      <p>Your OTP for changing the role of a user is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 5 minutes. Do not share it with anyone.</p>
      <p>Regards,<br/>Mahi Technocrafts Team</p>
    `;

    await mailSender(email, "OTP for Role Change", htmlBody);

    res.status(200).json({ message: "OTP sent successfully." });
  } catch (err) {
    console.error("OTP Send Error:", err);
    res.status(500).json({ message: "Server error while sending OTP." });
  }
});



router.post("/verify-role-change-otp", async (req, res) => {
  const { email, otp, userId, role } = req.body;

  const otpRecord = await OTP.findOne({ email });
  if (!otpRecord) return res.status(400).json({ message: "OTP not found." });

  const isValid = otpRecord.otp === otp && (Date.now() - otpRecord.createdAt.getTime()) < 5 * 60 * 1000;
  if (!isValid) return res.status(400).json({ message: "Invalid or expired OTP." });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found." });

  user.isAdmin = role === "admin" ? "true" : "false";
  await user.save();
  await OTP.deleteOne({ email });

  res.status(200).json({ message: `User role updated to ${role}` });
});
router.get("/user-details/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    let user;

    // Check if ID is valid Mongo ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    if (isObjectId) {
      user = await User.findById(id).lean();
    }

    // Fallback to checking by email only if not found and ID is not ObjectId
    if (!user) {
      user = await User.findOne({ email: id }).lean();
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user details",
    });
  }
});





router.get('/check/:userId/:roomId', checkIfUserJoinedMeeting);
router.put("/update-profile", updateProfile);
router.get('/myprofile/:id', getProfile);

module.exports = router;
