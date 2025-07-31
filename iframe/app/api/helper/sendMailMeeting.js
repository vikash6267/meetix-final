exports.basicMeetingInviteTemplate = ({ roomURL, password }) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333;">You're Invited to a Video Meeting</h2>
        <p style="font-size: 16px;">Click the button below to join the meeting:</p>
        <p style="margin: 20px 0;">
          <a href="${roomURL}" style="display: inline-block; padding: 10px 20px; background-color: #007BFF; color: white; text-decoration: none; border-radius: 5px;">Join Meeting</a>
        </p>
        ${password ? `<p style="font-size: 14px;">🔒 <strong>Password:</strong> ${password}</p>` : ''}
        <hr />
        <p style="font-size: 12px; color: #888;">If the button doesn't work, copy and paste this URL into your browser:</p>
        <p style="font-size: 12px;">${roomURL}</p>
      </div>
    </div>
  `;
};
