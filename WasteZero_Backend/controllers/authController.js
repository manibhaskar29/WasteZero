import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import { sendResetEmail, sendOtpEmail } from "../utils/email.js"; // added sendOtpEmail

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

/** 🔐 Helper to issue JWT token */
function issueJwt(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/** 🧾 SEND OTP FOR SIGNUP */
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a JWT containing email + OTP
    const token = jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.json({ message: "OTP sent to your email", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};
/** ✅ VERIFY OTP AND CREATE ACCOUNT */
export const verifyOtpAndSignup = async (req, res) => {
  const { email, otp, token, userData } = req.body;
  if (!email || !otp || !token || !userData)
    return res.status(400).json({ message: "Missing parameters" });

  try {
    // Verify OTP JWT
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.otp !== otp || payload.email !== email) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already registered" });

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create new user
    const user = await User.create({
      name: userData.name,
      username: userData.username,
      email,
      password: hashedPassword,
      role: userData.role || "user",
      location: userData.location || "",
      skills: userData.skills || [],
    });

    // Issue auth JWT for login
    const authToken = jwt.sign(
      { sub: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Signup successful",
      token: authToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "OTP expired" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/** 🔑 LOGIN */
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !user.password)
      return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = issueJwt(user);
    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/** 🔄 FORGOT PASSWORD (Request Reset Link) */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(200)
        .json({ message: "If that email exists, a reset link has been sent." });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour
    await user.save();

    const resetUrl = `${FRONTEND}/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    await sendResetEmail(email, resetUrl);

    res.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/** ✅ RESET PASSWORD (Complete reset) */
export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password)
    return res.status(400).json({ message: "Missing parameters" });

  try {
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/** 🧍‍♂️ GET CURRENT USER INFO */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select(
      "-password -resetPasswordToken -resetPasswordExpires -otp -otpExpires"
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
