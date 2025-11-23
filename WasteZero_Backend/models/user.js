import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String },
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String }, // hashed password
    location: { type: String },
    provider: { type: String, enum: ["local", "google", "github"], default: "local" },
    providerId: { type: String },
    role: { type: String, enum: ["user", "ngo", "admin"], default: "user" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
