import express from "express";
import User from "../models/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

const CHAT_RULES = {
  admin: [ "admin","ngo", "user"],
  ngo: ["admin", "user"],
  user: ["admin", "ngo"],
};

router.get("/", authMiddleware, async (req, res) => {
  try {
    const loggedUserId = mongoose.Types.ObjectId.createFromHexString(req.user.sub);
    const loggedRole = req.user.role;

    const allowedRoles = CHAT_RULES[loggedRole];

    const users = await User.find({
      _id: { $ne: loggedUserId },
      role: { $in: allowedRoles },
    }).select("name role email");

    

    res.json(users);
  } catch (err) {
    console.error("User fetch error:", err);
    res.status(500).json({ message: "Failed to load users" });
  }
});

export default router;
