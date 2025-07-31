const reminderMeetingTemplate = ({ meetingName, scheduleDateTime, shortSummary, roomId }) => {
  const now = new Date();
  const scheduledTime = new Date(scheduleDateTime);
  const diffInMs = scheduledTime - now;
  const diffInMinutes = Math.floor(diffInMs / 60000);

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>🔔 Meeting Reminder</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          background-color: #fff;
          margin: 0 auto;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .title {
          font-size: 22px;
          font-weight: bold;
          color: #2c3e50;
        }
        .time-left {
          margin: 10px 0 20px;
          font-size: 16px;
          color: #555;
        }
        .summary {
          margin: 20px 0;
        }
        .btn {
          display: inline-block;
          padding: 12px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
          margin-top: 20px;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          font-size: 13px;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="title">Reminder: Upcoming Meeting - ${meetingName}</p>

        <p class="time-left">🕒 The meeting will start in <strong>${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}</strong></p>

        ${
          shortSummary
            ? `<div class="summary"><strong>Summary:</strong><br/>${shortSummary}</div>`
            : ""
        }

        <a class="btn" href="http://localhost:3010/join/?room=${roomId}">
          🔗 Join Meeting
        </a>

        <div class="footer">
          This is an automated reminder email from Meetix.<br/>
          Please do not reply to this message.
        </div>
      </div>
    </body>
  </html>`;
};

module.exports = reminderMeetingTemplate;
