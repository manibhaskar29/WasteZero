// /src/services/chatService.js
import axios from "axios";

const API = import.meta.env.VITE_BACKEND_API_URL;

export const fetchChatsApi = async () => {
  const res = await fetch(`${API}/chats`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  if (!res.ok) throw new Error("Failed to fetch chats");
  return res.json();
};

export const fetchChatHistoryApi = async (chatId) => {
  const res = await fetch(`${API}/chats/${chatId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });

  if (!res.ok) throw new Error("Failed to fetch history");
  return res.json();
};

export const createChatApi = async (userId) => {
  const res = await fetch(`${API}/chats`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ userId }), // FIXED
  });

  if (!res.ok) throw new Error("Failed to create chat");
  return res.json();
};

export const fetchAllUsers = async () => {
  const res = await fetch(`${API}/users`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  return res.json();


};

export const createOneToOneChatApi = async (userId) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API}/chats/find-or-create`,
    { userId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data; // should return the chat object
};