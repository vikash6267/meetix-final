// /controllers/otpController.js
const mailSender = require("../helper/mailsender");
const otpTemplate = require("../helper/otpTemplate");
const OTPModel = require("../models/OTP");
const User = require("../models/User");
const bcrypt = require('bcrypt');

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

exports.resetPassword = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !password || !confirmPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error while resetting password" });
  }
}