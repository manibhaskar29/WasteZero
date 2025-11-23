import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.js";
import { sendResetEmail } from "../utils/email.js";


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

/** 🧑‍💻 SIGN UP */
/** 🧑‍💻 SIGN UP */
export const signup = async (req, res) => {
  const { name, username, email, password, role, location } = req.body;

  // ✅ Basic validation
  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: "Name, username, email, and password are required" });
  }

  try {
    // Check if email or username already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(409).json({ message: "Email already registered" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(409).json({ message: "Username already taken" });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hash,
      role: role || "user",
      location: location || "",
      provider: "local",
    });

    // Issue JWT
    const token = issueJwt(user);

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        location: user.location,
      },
    });
  } catch (err) {
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
      "-password -resetPasswordToken -resetPasswordExpires"
    );
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
