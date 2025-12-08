import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} from "../controllers/notficationController.js";

const router = express.Router();

router.get("/", requireAuth, getNotifications);
router.patch("/:notificationId/read", requireAuth, markAsRead);
router.patch("/read-all", requireAuth, markAllAsRead);
router.delete("/:notificationId", requireAuth, deleteNotification);

export default router;
