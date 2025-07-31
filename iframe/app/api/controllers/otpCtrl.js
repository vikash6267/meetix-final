// /controllers/otpController.js
const mailSender = require("../helper/mailsender");
const otpTemplate = require("../helper/otpTemplate");
const OTPModel = require("../models/OTP");

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP

  await OTPModel.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true, new: true }
  );

  const html = otpTemplate(otp);

  try {
    await mailSender(email, "Your MEETIX OTP Code", html);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });

  const record = await OTPModel.findOne({ email });
  if (!record) return res.status(400).json({ message: "OTP not found" });

  if (record.otp !== otp)
    return res.status(400).json({ message: "Invalid OTP" });

  await OTPModel.deleteOne({ email });

  res.status(200).json({ message: "OTP verified" });
};
