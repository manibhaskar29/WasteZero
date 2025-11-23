import express from "express";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import cookieSession from "cookie-session";
import passport from "passport";

import authRoutes from "./routes/auth.js";
import "./config/passport.js"; // passport strategies
import opportunityRoutes from "./routes/opportunity.routes.js";

const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// cookie session for passport (OAuth)
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY || "change-me"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);

// Ping test route
app.get("/api/ping", (req, res) => res.json({ ok: true }));

// 👉 Correct ES module version (already imported at top)
app.use("/api/opportunities", opportunityRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { dbName: "wastezero" })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
