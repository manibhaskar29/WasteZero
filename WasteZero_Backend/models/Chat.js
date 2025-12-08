// models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    participantsKey: { type: String, unique: true },
    lastMessage: String,
    lastMessageTime: Date,
  },
  { timestamps: true }
);

// --- FIX: safe function ---
function computeParticipantsKey(participants) {
  const ids = participants
    .map((p) => {
      if (!p) return null;

      // p can be objectId, populated user, or {_id}
      if (typeof p === "string") return p;
      if (p.sub) return p.sub.toString();
      if (p.toString) return p.toString();

      return null;
    })
    .filter(Boolean); // remove nulls

  if (ids.length !== 2) {
    console.log("INVALID PARTICIPANTS:", participants);
    throw new Error("Participants must contain exactly 2 valid user IDs.");
  }

  return ids.sort().join("_");
}

chatSchema.statics.makeKey = function (participants) {
  return computeParticipantsKey(participants);
};

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
