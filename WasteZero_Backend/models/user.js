import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    location: { type: String },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: { type: String },

    // roles: user | ngo | admin
    role: { type: String, enum: ["user", "ngo", "admin"], default: "user" },

    skills: { type: [String], default: [] },

    // ⭐ For leaderboard (your logic)
    totalWasteRecycled: { type: Number, default: 0 },

    // ⭐ Admin Controls

    // 1. USER SUSPENSION
    isSuspended: { type: Boolean, default: false }, // for normal users

    // 2. NGO VERIFICATION STATUS
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // 3. NGO DISABLE FLAG
    isDisabled: { type: Boolean, default: false }, // for NGO accounts

    // Forgot password tokens
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
