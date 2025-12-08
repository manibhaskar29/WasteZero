import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_BACKEND_API_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  transports: ["websocket", "polling"], // fallback included
});

// Connect with JWT
export const connectSocket = ({ token, userId }) => {
  if (!token || !userId) return;
  if (!socket.connected) {
    
    socket.auth = { token, userId };
    socket.connect();
  }
};

// Disconnect safely
export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

// Listeners
export const on = (event, cb) => socket.on(event, cb);
export const off = (event, cb) => socket.off(event, cb);
export const emit = (event, ...args) => socket.emit(event, ...args);
