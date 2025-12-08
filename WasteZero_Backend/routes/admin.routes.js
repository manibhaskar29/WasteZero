import express from "express";
import { adminOnly } from "../middlewares/adminOnly.js";
import  authMiddleware  from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  updateUser,
  suspendUser,
  deleteUserAdmin,
  getAllNGOs,
  approveNGO,
  rejectNGO,
  disableNGO,
} from "../controllers/admin.controller.js";

const router = express.Router();

/* USER MANAGEMENT */
router.get("/users", authMiddleware, adminOnly, getAllUsers);
router.put("/users/:id", authMiddleware, adminOnly, updateUser);
router.patch("/users/:id/suspend", authMiddleware, adminOnly, suspendUser);
router.delete("/users/:id", authMiddleware, adminOnly, deleteUserAdmin);

/* NGO MANAGEMENT */
router.get("/ngos", authMiddleware, adminOnly, getAllNGOs);
router.patch("/ngos/:id/approve", authMiddleware, adminOnly, approveNGO);
router.patch("/ngos/:id/reject", authMiddleware, adminOnly, rejectNGO);
router.patch("/ngos/:id/disable", authMiddleware, adminOnly, disableNGO);

export default router;
