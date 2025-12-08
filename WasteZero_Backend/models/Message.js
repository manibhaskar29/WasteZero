// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  chatId: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  file: String,
  fileName: String,
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  status: { type: String, default: "sent" },
  time: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
