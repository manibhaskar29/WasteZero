import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createPickup,
  getPickupHistory,
  updatePickup,
  enrollInPickup
} from "../controllers/pickupController.js";

const router = express.Router();

router.post("/", authMiddleware, createPickup);
router.get("/history", authMiddleware, getPickupHistory);
router.patch("/:id", authMiddleware, updatePickup);
router.post("/:id/enroll", authMiddleware, enrollInPickup);

export default router;
