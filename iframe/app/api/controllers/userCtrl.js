const User = require("../models/User");
const Attendee = require('../models/Attendee');
const Session = require('../models/Session');
const mailSender = require("../helper/mailsender");
const meetingTemplate = require("../helper/meetingTemplate");
const { basicMeetingInviteTemplate } = require("../helper/sendMailMeeting");


// 🔹 Add an upcoming meeting
exports.addUpcomingMeeting = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      roomId,
      meetingName,
      scheduleDateTime,
      isJoined,
      joinedAt,
      shortSummary,
      participants,
      isCancelled,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newMeeting = {
      roomId,
      meetingName,
      scheduleDateTime,
      isJoined,
      joinedAt,
      shortSummary,
      participants,
      isCancelled,
    };

    user.upCommingMeetings.push(newMeeting);
    await user.save();
const emailHTML = meetingTemplate({
  type: "create",
  meetingName,
  scheduleDateTime,
  shortSummary,
  roomId,
});

// Send email to all participants
for (let email of participants) {
  await mailSender(email, "New Meeting Scheduled", emailHTML);
}
    res.status(200).json({
      success: true,
      message: "Upcoming meeting added successfully",
      upCommingMeetings: user.upCommingMeetings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};




// 🔹 Update a specific upcoming meeting
exports.updateUpcomingMeeting = async (req, res) => {
  try {
    const { userId, meetingId } = req.params;
    const {
      roomId,
      meetingName,
      scheduleDateTime,
      isJoined,
      joinedAt,
      shortSummary,
      participants,
      isCancelled,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const meeting = user.upCommingMeetings.id(meetingId);
    if (!meeting) {
      return res.status(404).json({ success: false, message: "Meeting not found" });
    }

    // Save old data for comparison
    const oldMeeting = {
      meetingName: meeting.meetingName,
      scheduleDateTime: meeting.scheduleDateTime,
      shortSummary: meeting.shortSummary,
      isCancelled: meeting.isCancelled,
    };

    // Update only provided fields
    if (roomId !== undefined) meeting.roomId = roomId;
    if (meetingName !== undefined) meeting.meetingName = meetingName;
    if (scheduleDateTime !== undefined) meeting.scheduleDateTime = scheduleDateTime;
    if (isJoined !== undefined) meeting.isJoined = isJoined;
    if (joinedAt !== undefined) meeting.joinedAt = joinedAt;
    if (shortSummary !== undefined) meeting.shortSummary = shortSummary;
    if (participants !== undefined) meeting.participants = participants;
    if (isCancelled !== undefined) meeting.isCancelled = isCancelled;

    await user.save();

    // ✅ Compare relevant fields
    const shouldSendEmail =
      (meetingName && meetingName !== oldMeeting.meetingName) ||
      (scheduleDateTime && scheduleDateTime !== oldMeeting.scheduleDateTime) ||
      (shortSummary && shortSummary !== oldMeeting.shortSummary) ||
      (typeof isCancelled === "boolean" && isCancelled !== oldMeeting.isCancelled);

    if (shouldSendEmail) {
      const emailHTML = meetingTemplate({
        type: isCancelled ? "cancel" : "update",
        meetingName: meeting.meetingName,
        scheduleDateTime: meeting.scheduleDateTime,
        shortSummary: meeting.shortSummary,
        roomId: meeting.roomId,
      });

      const recipientList = meeting.participants || []; // fallback if not sent from frontend
      for (let email of recipientList) {
        await mailSender(email, isCancelled ? "Meeting Cancelled" : "Meeting Updated", emailHTML);
      }
    }

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      updatedMeeting: meeting,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getUpcomingMeetings = async (req, res) => {
  try {
    const { userId } = req.params;
console.log(userId)
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Upcoming meetings fetched successfully",
      upCommingMeetings: user.upCommingMeetings,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// 🔹 Delete a specific upcoming meeting
exports.deleteUpcomingMeeting = async (req, res) => {
  try {
    const { userId, meetingId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const meeting = user.upCommingMeetings.id(meetingId);
    if (!meeting) return res.status(404).json({ success: false, message: "Meeting not found" });

    meeting.remove();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Upcoming meeting deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getRoomDetails = async (req, res) => {
  const { roomId } = req.params;

  try {
    // 1. Get users with messages or recordings from the room
    const users = await User.find({
      $or: [
        { 'roomActivity.roomId': roomId },
        { 'recordings.roomId': roomId }
      ]
    });

    let allMessages = [];
    let allRecordings = [];

    users.forEach(user => {
      // Extract messages
      if (user.roomActivity?.length > 0) {
        user.roomActivity.forEach(activity => {
          if (activity.roomId === roomId && activity.messages) {
            allMessages.push(...activity.messages);
          }
        });
      }

      // Extract recordings
      if (user.recordings?.length > 0) {
        user.recordings.forEach(rec => {
          if (rec.roomId === roomId) {
            allRecordings.push(rec);
          }
        });
      }
    });

    // 2. Get all attendees
    const attendees = await Attendee.find({ roomId });

    // 3. Get session info
    const session = await Session.findOne({ sessionId: roomId });

    return res.status(200).json({
      success: true,
      roomId,
      messages: allMessages,
      recordings: allRecordings,
      attendees,
      session
    });
  } catch (err) {
    console.error('Error fetching room details:', err);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: err.message
    });
  }
};


exports.getUserMeetingsDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const meetingsData = [];

    for (const meeting of user.meetings) {
      const roomId = meeting.roomId;

      // 1. Get all messages for roomId
      const usersWithRoom = await User.find({ 'roomActivity.roomId': roomId });
      let allMessages = [];
      usersWithRoom.forEach(u => {
        u.roomActivity.forEach(activity => {
          if (activity.roomId === roomId && activity.messages?.length) {
            allMessages.push(...activity.messages);
          }
        });
      });

      const messageCount = allMessages.length;

      // 2. Extract unique peerNames from messages
      const messagePeerNames = new Set(
        allMessages.map(msg => msg.peer_name).filter(Boolean)
      );

      // 3. Get attendees whose peerName exists in messages
      const allAttendees = await Attendee.find({ roomId });
      const filteredAttendees = allAttendees.filter(att =>
        messagePeerNames.has(att.peerName)
      );
      const uniqueAttendeeNames = new Set(
        filteredAttendees.map(att => att.peerName)
      );
      const attendeeCount = uniqueAttendeeNames.size;

      // 4. Get sessions with hostName that exists in messages
      const allSessions = await Session.find({ sessionId: roomId });
      const filteredSessions = allSessions.filter(session =>
        messagePeerNames.has(session.hostName)
      );
      const uniqueSessionHostNames = new Set(
        filteredSessions.map(s => s.hostName)
      );
      const sessionCount = uniqueSessionHostNames.size;

      // 5. Get recording count
      const allUsersWithRecordings = await User.find({ 'recordings.roomId': roomId });
      let recordingCount = 0;
      allUsersWithRecordings.forEach(u => {
        u.recordings.forEach(rec => {
          if (rec.roomId === roomId) {
            recordingCount++;
          }
        });
      });

      meetingsData.push({
        roomId,
        joinedAt: meeting.joinedAt,
        messageCount,
        attendeeCount,
        sessionCount,
        recordingCount
      });
    }

    return res.status(200).json({
      success: true,
      userId,
      totalMeetings: user.meetings.length,
      meetings: meetingsData
    });

  } catch (err) {
    console.error('Error fetching meeting data:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};


exports.sendMeetingInvite = async (req, res) => {
  try {
    const { to, roomURL, password } = req.body;

    if (!to || !roomURL) {
      return res.status(400).json({ success: false, message: 'Email and Room URL are required.' });
    }

    const html = basicMeetingInviteTemplate({ roomURL, password });

    await mailSender(to, 'Join Your Video Meeting', html);

    res.status(200).json({ success: true, message: 'Email sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send email.' });
  }
};