// socket/chatSocket.js
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import mongoose from "mongoose";

export const initChatSocket = (io) => {

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;

    if (!token) return next(new Error("Token missing"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    
    const userId = socket.user.sub.toString();

    socket.join(userId);

    socket.on("setup", () => {
      socket.emit("connected");
    });

    socket.on("join_chat", (chatId) => {
      if (chatId) socket.join(chatId);
    });

    socket.on("send_message", async (msg, ack) => {
      try {
        const from = userId;
        const to = msg.to.toString();;

        // Ensure chat exists
        const key = Chat.makeKey([from, to]);

        let chat = await Chat.findOne({ participantsKey: key });
        let newlyCreated = false;

        if (!chat) {
          chat = await Chat.create({
            participants: [from, to],
            participantsKey: key,
            lastMessageTime: new Date()
          });
          newlyCreated = true;
        }

        const message = await Message.create({
          chatId: chat._id,
          from,
          to,
          text: msg.text,
          time: new Date(),
        });

        await Chat.findByIdAndUpdate(chat._id, {
          lastMessage: msg.text,
          lastMessageTime: new Date(),
        });

        const populatedMessage = await Message.findById(message._id)
          .populate("from", "name role")
          .populate("to", "name role");

        const populatedChat = await Chat.findById(chat._id)
          .populate("participants", "name role");

        // Emit only once
        io.to(chat._id.toString()).emit("receive_message", populatedMessage);

        // Notify receiver
        io.to(to.toString()).emit("notification", {
          type: "new_message",
          chat: populatedChat,
          message: populatedMessage
        });

        // If new chat
        if (newlyCreated) {
          io.to(from.toString()).emit("chat_created", populatedChat);
          io.to(to.toString()).emit("chat_created", populatedChat);
        }

        // ACK ONLY TO SENDER
        ack?.({ ok: true, message: populatedMessage, chat: populatedChat });

      } catch (err) {
        console.error("send_message socket error:", err);
        ack?.({ ok: false, error: err.message });
      }
    });
  });
};
