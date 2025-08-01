const meetingTemplate = ({ type, meetingName, scheduleDateTime, shortSummary, roomId }) => {
  const actionText = type === 'create'
    ? 'has been scheduled'
    : type === 'update'
    ? 'has been updated'
    : 'has been cancelled';

  const showCTA = type !== 'cancel';

  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8">
      <title>Meeting ${actionText}</title>
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
        .subtitle {
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
          background-color: #16a085;
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
        <p class="title">Meeting ${actionText} - ${meetingName}</p>
        <p class="subtitle">Scheduled at: <strong>${new Date(scheduleDateTime).toLocaleString()}</strong></p>
        ${shortSummary ? `<div class="summary"><strong>Summary:</strong><br/>${shortSummary}</div>` : ''}
        ${showCTA ? `<a class="btn" href="https://meetix.mahitechnocrafts.in/join/?room=${roomId}">Join Meeting</a>` : ''}
        <div class="footer">
      
        </div>
      </div>
    </body>
  </html>`;
};

module.exports = meetingTemplate;
