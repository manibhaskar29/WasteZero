import bcrypt from "bcryptjs";
import User from "../models/user.js";

/** 🧍‍♂️ Get current user */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.sub).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/** ✏️ Update current user */
export const updateCurrentUser = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user.sub, updates, {
      new: true,
    }).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/** 🔐 Change password */
export const changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "Current and new passwords required" });

  try {
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return res.status(401).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
