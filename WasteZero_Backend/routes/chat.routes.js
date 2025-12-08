import express from "express";
import { getChatList, getChatHistory, createChat } from "../controllers/chatController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getChatList);
router.get("/:chatId", authMiddleware, getChatHistory);
router.post("/find-or-create", authMiddleware, createChat);
router.post("/", authMiddleware, createChat);

export default router;
