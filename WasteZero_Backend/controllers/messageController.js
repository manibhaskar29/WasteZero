// controllers/messageController.js
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { participantId, text, chatId } = req.body;

    if (!text?.trim()) return res.status(400).json({ message: "Empty message" });

    let chat = null;

    if (chatId) {
      chat = await Chat.findById(chatId);
    } else {
      const key = Chat.makeKey([userId, participantId]);
      chat = await Chat.findOne({ participantsKey: key });

      if (!chat) {
        chat = await Chat.create({
          participants: [userId, participantId],
          participantsKey: key,
          lastMessageTime: new Date()
        });
      }
    }

    const message = await Message.create({
      chatId: chat._id,
      from: userId,
      to: participantId,
      text,
      status: "sent",
      time: new Date(),
    });

    await Chat.findByIdAndUpdate(chat._id, {
      lastMessage: text,
      lastMessageTime: new Date()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate("from", "name role")
      .populate("to", "name role");

    const populatedChat = await Chat.findById(chat._id)
      .populate("participants", "name role");

    res.json({ chat: populatedChat, message: populatedMessage });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send message" });
  }
};
