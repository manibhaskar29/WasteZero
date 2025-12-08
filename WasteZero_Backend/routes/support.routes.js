import express from "express";
import { sendSupportEmail } from "../utils/email.js";

const router = express.Router();

router.post("/contact", async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: "Email and message are required" });
    }

    await sendSupportEmail(email, message);

    res.json({ success: true, message: "Support request sent successfully" });
  } catch (err) {
    console.error("Support Email Error:", err);
    res.status(500).json({ error: "Failed to send support request" });
  }
});


export default router;