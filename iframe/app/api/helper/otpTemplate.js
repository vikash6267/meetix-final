const otpTemplate = (otp) => {
  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>OTP Verification - MEETIX</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      background-color: #f4f4f4;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      margin: 0;
      padding: 0;
      color: #333333;
    }

    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .header h1 {
      color: #FFD60A;
      margin: 0 0 20px;
      font-size: 32px;
    }

    .message-title {
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #222;
    }

    .body-text {
      font-size: 16px;
      margin: 20px 0;
      line-height: 1.6;
    }

    .otp-code {
      display: inline-block;
      margin: 25px 0;
      font-size: 26px;
      letter-spacing: 6px;
      background-color: #f0f0f0;
      padding: 15px 25px;
      border-radius: 8px;
      font-weight: bold;
      color: #000;
    }

    .footer {
      margin-top: 30px;
      font-size: 14px;
      color: #777;
    }

    .footer a {
      color: #007bff;
      text-decoration: none;
    }

    @media only screen and (max-width: 600px) {
      .container {
        padding: 20px;
      }

      .otp-code {
        font-size: 22px;
        padding: 12px 20px;
      }
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">
      <h1>MEETIX</h1>
    </div>

    <div class="message-title">OTP Verification Email</div>

    <div class="body-text">
      <p>Dear User,</p>
      <p>Thank you for registering with <strong>MEETIX</strong>. Please use the OTP below to verify your account:</p>

      <div class="otp-code">${otp}</div>

      <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore this email.</p>
      <p>Once verified, you’ll have access to all features of the platform.</p>
    </div>

    <div class="footer">
      Need help? Contact us at
      <a href="mailto:info@meetix.com">info@meetix.com</a>
    </div>
  </div>
</body>

</html>`;
};

module.exports = otpTemplate;
