import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/users.routes.js";
import authRoutes from "./routes/auth.js";
import "./config/passport.js";
import opportunityRoutes from "./routes/opportunity.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import pickupRoutes from "./routes/pickup.routes.js"
import { initChatSocket } from "./socket/chatSocket.js";
import dashboardRoutes from "./routes/dashboard.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import ApplicationRoutes from "./routes/application.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import supportRoutes from "./routes/support.routes.js";
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

// ---------- CORS ----------
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// ---------- SECURITY MIDDLEWARE ----------
app.use(helmet());

// ---------- BODY PARSING ----------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------- COOKIE SESSION (OAuth) ----------
app.use(
  cookieSession({
    name: "oauth-session",
    keys: [process.env.COOKIE_KEY || "change-me"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ---------- API ROUTES ----------
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/chats", chatRoutes); // <-- FIXED
app.use("/api/pickup",pickupRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/applications", ApplicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/support", supportRoutes);

// Test Route
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// ---------- HTTP SERVER ----------
const server = http.createServer(app);

// ---------- SOCKET.IO SERVER ----------
const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["Authorization"],
  },
});

// Initialize chat websocket
initChatSocket(io);

// ---------- MONGO + START SERVER ----------
mongoose
  .connect(process.env.MONGO_URI, { dbName: "wastezero" })
  .then(() => {
    console.log("Connected to MongoDB Atlas");

    server.listen(PORT, () =>
      console.log(`🚀 Server (HTTP + WebSocket) running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
