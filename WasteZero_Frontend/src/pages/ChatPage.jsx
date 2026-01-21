import React, { useEffect, useState, useRef, useCallback } from "react";
// services you already provided
import { connectSocket, disconnectSocket, on, off, emit, socket } from "../services/socket";
import {
  fetchChatsApi,
  fetchChatHistoryApi,
  createOneToOneChatApi,
  fetchAllUsers,
} from "../services/chatService";

export default function ChatPage() {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({}); // { chatId: [msg,...] }
  const [input, setInput] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);

  const userId = localStorage.getItem("userId");
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // -----------------------
  // 1) Connect socket & setup
  // -----------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token || !userId) return;

    // use your connect helper (sets auth and connects)
    connectSocket({ token, userId });

    const handleConnect = () => {
      console.log("Socket connected");
      setSocketConnected(true);
      // join personal room for notifications
      emit("setup", userId);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setSocketConnected(false);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      disconnectSocket();
    };
  }, [userId]);

  // -----------------------
  // 2) Load initial users + chats
  // -----------------------
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [usersData, chatsData] = await Promise.all([fetchAllUsers(), fetchChatsApi()]);
        if (!mounted) return;
        setAllUsers(usersData || []);
        setChats(Array.isArray(chatsData) ? chatsData : []);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  // -----------------------
  // 3) Auto-join all chat rooms after chats are loaded & socket connects
  // -----------------------
  useEffect(() => {
    if (!socketConnected || !Array.isArray(chats) || chats.length === 0) return;

    // join every chat so server can send room messages
    chats.forEach((chat) => {
      try {
        emit("join_chat", chat._id);
      } catch (e) {
        // ignore
      }
    });
  }, [socketConnected, chats]);

  // -----------------------
  // 4) Listen for chat_created -> add chat & join it
  // -----------------------
  useEffect(() => {
    if (!socketConnected) return;

    const handleChatCreated = (chat) => {
      if (!chat || !chat._id) return;
      setChats((prev) => {
        if (prev.some((c) => c._id === chat._id)) return prev;
        return [chat, ...prev];
      });
      // join room immediately
      emit("join_chat", chat._id);
    };

    on("chat_created", handleChatCreated);
    return () => off("chat_created", handleChatCreated);
  }, [socketConnected]);

  // -----------------------
  // 5) Listen for notifications -> badge / add chat
  // -----------------------
  useEffect(() => {
    if (!socketConnected) return;

    const handleNotification = (data) => {
      // backend emits: { type: 'new_message', chat, message }
      if (!data) return;
      const chat = data.chat || data.chatId ? data.chat : null;
      // If chat object provided, ensure it's in list and join it
      if (chat && chat._id) {
        setChats((prev) => {
          if (prev.some((c) => c._id === chat._id)) return prev;
          return [chat, ...prev];
        });
        emit("join_chat", chat._id);
      } else if (data.chatId) {
        // fetch chats if only id given (fallback)
        (async () => {
          try {
            const fresh = await fetchChatsApi();
            if (Array.isArray(fresh)) {
              setChats(fresh);
            }
          } catch (err) {
            console.error("Failed to refresh chats on notification", err);
          }
        })();
      }

      // mark unread count if you want (optional)
      if (data.chat && data.message) {
        setChats((prev) =>
          prev.map((c) =>
            c._id === data.chat._id ? { ...c, unread: (c.unread || 0) + 1 } : c
          )
        );
      }
    };

    on("notification", handleNotification);
    return () => off("notification", handleNotification);
  }, [socketConnected]);

  // -----------------------
  // 6) Handle incoming messages (receive_message)
  // -----------------------
  useEffect(() => {
    if (!socketConnected) return;

    const handleReceive = async (msg) => {
      if (!msg || !msg.chatId) return;

      // normalize sender id
      const senderId = msg.from?._id || msg.from;
      if (senderId === userId) return;

      // If new chat, refresh chat list and join its room
      const chatExists = chats.some((c) => c._id === msg.chatId);
      if (!chatExists) {
        try {
          const freshChats = await fetchChatsApi();
          if (Array.isArray(freshChats)) {
            setChats(freshChats);
            emit("join_chat", msg.chatId);
          }
        } catch (err) {
          console.error("Failed to fetch chats after incoming message", err);
        }
      }

      // Add message to messages state without duplicates
      setMessages((prev) => {
        const existing = prev[msg.chatId] || [];
        const dup = existing.some(
          (m) => (m._id === msg._id) || (m.tempId && msg.tempId && m.tempId === msg.tempId)
        );
        if (dup) return prev;

        const newMsg = { ...msg, sender: "them" };
        return {
          ...prev,
          [msg.chatId]: [...existing, newMsg],
        };
      });

      // Scroll if active chat
      if (activeChat === msg.chatId) scrollToBottom();
    };

    on("receive_message", handleReceive);
    return () => off("receive_message", handleReceive);
  }, [socketConnected, chats, activeChat, userId, scrollToBottom]);

  // -----------------------
  // 7) Open chat & load history
  // -----------------------
  useEffect(() => {
    if (!activeChat) return;
    let mounted = true;

    const loadHistory = async () => {
      try {
        const hist = await fetchChatHistoryApi(activeChat);
        if (!mounted) return;
        if (Array.isArray(hist)) {
          setMessages((prev) => ({
            ...prev,
            [activeChat]: hist.map((msg) => ({
              ...msg,
              sender: msg.from === userId || msg.from?._id === userId ? "me" : "them",
            })),
          }));
        }
        // ensure joined
        emit("join_chat", activeChat);
        scrollToBottom();
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };

    loadHistory();
    return () => { mounted = false; };
  }, [activeChat, userId, scrollToBottom]);

  // -----------------------
  // 8) Send message (optimistic + ack)
  // -----------------------
  const sendMessage = async () => {
    if (!input.trim() || !activeChat) return;

    // find chat to get recipient
    const chat = chats.find((c) => c._id === activeChat);
    console.log(chat);

    if (!chat) return;

    // Safely resolve other participant id (works with populated objects or raw ids)
    const otherUserObj = chat.participants?.find((p) => {
      const pid = p?._id || p;
      return pid !== userId;
    });
    const toUserId = otherUserObj?._id?.toString() || otherUserObj?.toString();
    if (!toUserId) {
      console.error("Could not determine recipient id for chat:", activeChat, chat);
      return;
    }

    const tempId = `tmp_${Date.now()}`;
    const outgoing = {
      tempId,
      chatId: activeChat,
      from: userId,
      to: toUserId,
      text: input,
      time: new Date().toISOString(),
      status: "sending",
    };

    // optimistic UI update
    setMessages((prev) => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), { ...outgoing, sender: "me" }],
    }));
    setInput("");
    scrollToBottom();

    // emit with ack — backend will reply with { ok: true, message, chat }
    emit("send_message", outgoing, (response) => {
      if (!response) return;
      if (response.ok && response.message) {
        setMessages((prev) => {
          const chatMsgs = prev[activeChat] || [];
          // replace temp message
          const replaced = chatMsgs.map((m) =>
            m.tempId && m.tempId === tempId ? { ...response.message, sender: "me" } : m
          );
          // if temp not found (rare), append the message (avoid drop)
          const foundTemp = chatMsgs.some((m) => m.tempId === tempId);
          return {
            ...prev,
            [activeChat]: foundTemp ? replaced : [...replaced, { ...response.message, sender: "me" }],
          };
        });

        // update chat last message/time in list
        if (response.chat && response.chat._id) {
          setChats((prev) =>
            prev.map((c) => (c._id === response.chat._id ? response.chat : c))
          );
        }
      } else {
        console.error("Message send failed ack:", response.error || response);
        // mark last optimistic message as failed (optional)
        setMessages((prev) => {
          const chatMsgs = prev[activeChat] || [];
          return {
            ...prev,
            [activeChat]: chatMsgs.map((m) =>
              m.tempId === tempId ? { ...m, status: "failed" } : m
            ),
          };
        });
      }
    });
  };

  // -----------------------
  // 9) Create or open 1:1 chat with a user
  // -----------------------
  const openOrCreateChatWithUser = async (targetUser) => {
    if (!targetUser || !targetUser._id) return;

    // check locally
    const existing = chats.find(c =>
      c.participants.length === 2 &&
      c.participants.some(p => (p._id || p) === userId) &&
      c.participants.some(p => (p._id || p) === targetUser._id)
    );
    if (existing) {
      setActiveChat(existing._id);
      return;
    }

    try {
      const newChat = await createOneToOneChatApi(targetUser._id);
      // createOneToOneChatApi should return the chat object
      if (!newChat || !newChat._id) return;

      const safeParticipants = newChat.participants?.length ? newChat.participants : [targetUser, { _id: userId }];
      const safeChat = { ...newChat, participants: safeParticipants };

      setChats((prev) => {
        if (prev.some((c) => c._id === safeChat._id)) return prev;
        return [safeChat, ...prev];
      });

      // prepare messages container
      setMessages((prev) => ({ ...prev, [safeChat._id]: prev[safeChat._id] || [] }));
      setActiveChat(safeChat._id);

      // join room ASAP
      emit("join_chat", safeChat._id);
    } catch (err) {
      console.error("Chat creation failed:", err);
    }
  };

  // -----------------------
  // 10) Scroll to bottom on messages change for the active chat
  // -----------------------
  useEffect(() => {
    if (!activeChat) return;
    scrollToBottom();
  }, [messages, activeChat, scrollToBottom]);

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className="flex h-screen bg-[#f6f8fb] font-inter overflow-hidden pt-16 dark:bg-zinc-900">
      {/* SIDEBAR */}
      <div className="w-[28%] bg-white dark:bg-zinc-800 border-r dark:border-zinc-700 overflow-y-auto">
        <div className="p-4 font-semibold text-lg border-b dark:border-zinc-700 dark:text-white">Users</div>
        {allUsers.map((u) => {
          const existingChat = chats.find((c) =>
            c.participants?.some((p) => {
              if (!p) return false;
              const pid = p?._id || p;
              return pid === u._id;
            })
          );

          const isActive = existingChat && existingChat._id === activeChat;

          return (
            <div
              key={u._id}
              onClick={() => openOrCreateChatWithUser(u)}
              className={`p-4 border-b dark:border-zinc-700 cursor-pointer transition flex justify-between items-center ${isActive ? "bg-green-100 dark:bg-green-900/30" : "hover:bg-gray-50 dark:hover:bg-zinc-700"}`}
            >
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">{u.name}</div>
                <small className="text-gray-500 dark:text-gray-400 uppercase text-xs">{u.role}</small>
              </div>
              {existingChat && <span className="text-xs text-green-600">●</span>}
            </div>
          );
        })}
      </div>

      {/* CHAT WINDOW */}
      <div className="w-[72%] flex flex-col bg-[#f6f8fb] dark:bg-zinc-900">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 bg-white dark:bg-zinc-800 border-b dark:border-zinc-700 shadow-sm z-10">
              <h6 className="font-semibold text-lg text-gray-800 dark:text-white">
                {(() => {
                  const chat = chats.find((c) => c._id === activeChat);
                  const other = chat?.participants?.find((p) => {
                    if (!p) return false;
                    const pid = p?._id || p;
                    return pid !== userId;
                  });
                  const otherId = other?._id || other;
                  const userDetails = allUsers.find((u) => u._id === otherId);
                  return userDetails?.name || other?.name || "Chat";
                })()}
              </h6>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
              {(messages[activeChat] || []).map((msg, index) => (
                <div
                  key={msg._id || msg.tempId}
                  className={`max-w-[65%] p-3 rounded-xl shadow-sm relative ${msg.sender === "me" ? "bg-green-100 dark:bg-green-900/40 ml-auto rounded-tr-none" : "bg-white dark:bg-zinc-800 border dark:border-zinc-700 rounded-tl-none"}`}
                >
                  <div className="text-sm text-gray-800 dark:text-gray-100 break-words">{msg.text}</div>
                  <div className="flex justify-end gap-1 items-center mt-1">
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">
                      {msg.time ? new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                    {msg.sender === "me" && (
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 ml-1">{msg.status === "sending" ? "🕓" : "✓"}</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-zinc-800 border-t dark:border-zinc-700 flex gap-3 items-center">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 p-3 border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-full focus:outline-none focus:border-green-500 dark:focus:border-green-400 transition"
                placeholder="Type a message…"
              />
              <button onClick={sendMessage} disabled={!input.trim()} className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
