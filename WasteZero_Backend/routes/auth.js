import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import  requireAuth  from "../middlewares/authMiddleware.js";
import { changeUserPassword } from "../controllers/userController.js";

const router = express.Router();

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";
const BACKEND = process.env.BACKEND_URL || "http://localhost:5173"; // your backend base
const OAUTH_CALLBACK_BASE = `${BACKEND}/api/auth/oauth/callback`;

/** 🧩 Local authentication routes */
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/** 🔐 Protected route example */
router.get("/me", requireAuth, getMe);

router.put("/me/password", requireAuth, changeUserPassword);

/** 🌐 OAuth - Google */
router.get(
  "/oauth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/oauth/callback/google",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user)
      return res.redirect(`${FRONTEND}/login?error=oauth-failed`);

    const token = jwt.sign(
      { sub: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // Redirect to frontend with JWT
    res.redirect(`${FRONTEND}/oauth-redirect?token=${token}`);
  }
);

/** 🌐 OAuth - GitHub */
router.get(
  "/oauth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/oauth/callback/github",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    if (!req.user)
      return res.redirect(`${FRONTEND}/login?error=oauth-failed`);

    const token = jwt.sign(
      { sub: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.redirect(`${FRONTEND}/oauth-redirect?token=${token}`);
  }
);

export default router;
