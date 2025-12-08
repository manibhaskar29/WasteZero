import dotenv from "dotenv";
dotenv.config();
import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  login,
  forgotPassword,
  resetPassword,
  getMe,
  sendOtp,
  verifyOtpAndSignup
} from "../controllers/authController.js";



import requireAuth from "../middlewares/authMiddleware.js";
import {
  deleteUser,
  updateCurrentUser,
  changeUserPassword
} from "../controllers/userController.js";

const router = express.Router();

const FRONTEND = process.env.FRONTEND_URL || "http://localhost:3000";

/* ------------------ OTP SIGNUP ROUTES ------------------ */
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndSignup);

/* ------------------ LOCAL AUTH ------------------ */
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

/* ------------------ USER ACCOUNT ------------------ */
router.delete("/me", requireAuth, deleteUser);
router.put("/me", requireAuth, updateCurrentUser);
router.put("/me/password", requireAuth, changeUserPassword);
router.get("/me", requireAuth, getMe);

/* ------------------ OAUTH: GOOGLE ------------------ */
router.get("/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/oauth/callback/google",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    if (!req.user) return res.redirect(`${FRONTEND}/login?error=oauth-failed`);

    const token = jwt.sign(
      { sub: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.redirect(`${FRONTEND}/oauth-redirect?token=${token}`);
  }
);

/* ------------------ OAUTH: GITHUB ------------------ */
router.get("/oauth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/oauth/callback/github",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    if (!req.user) return res.redirect(`${FRONTEND}/login?error=oauth-failed`);

    const token = jwt.sign(
      { sub: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    res.redirect(`${FRONTEND}/oauth-redirect?token=${token}`);
  }
);

export default router;
