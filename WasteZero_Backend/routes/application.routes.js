import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import Application from "../models/Application.js";

const router = express.Router();

router.get("/my", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.sub;
    const applications = await Application.find({ createdBy: userId });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
