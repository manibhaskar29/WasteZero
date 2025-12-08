// controllers/chatController.js
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

// ----------------------
// GET CHAT LIST
// ----------------------
export const getChatList = async (req, res) => {
  try {
    const userId = req.user.sub;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name role")
      .sort({ lastMessageTime: -1 });

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat list" });
  }
};

// ----------------------
// GET CHAT HISTORY
// ----------------------
export const getChatHistory = async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId })
      .populate("from", "name role")
      .populate("to", "name role")
      .sort({ time: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get chat history" });
  }
};

// ----------------------
// CREATE OR FIND CHAT
// ----------------------
export const createChat = async (req, res) => {
  try {
    const loggedUserId = req.user.sub;
    const { userId } = req.body;

    if (!userId)
      return res.status(400).json({ message: "User ID required" });

    if (userId === loggedUserId)
      return res.status(400).json({ message: "Cannot create chat with yourself" });

    const ids = [loggedUserId.toString(), userId.toString()];
    const participantsKey = Chat.makeKey(ids);

    let chat = await Chat.findOne({ participantsKey }).populate("participants", "name role");

    if (!chat) {
      chat = await Chat.create({
        participants: ids,
        participantsKey,
        lastMessageTime: new Date()
      });
      chat = await Chat.findById(chat._id).populate("participants", "name role");
    }

    return res.json(chat);
  } catch (err) {
    console.error("createChat error:", err);
    res.status(500).json({ message: "Could not create chat" });
  }
};
