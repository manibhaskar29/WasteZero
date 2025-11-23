import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import requireNGO from "../middlewares/roleCheck.js";

import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunity.controller.js";

const router = express.Router();

router.get("/", getAllOpportunities);
router.get("/:id", getOpportunityById);

router.post("/", requireAuth, requireNGO, createOpportunity);
router.put("/:id", requireAuth, requireNGO, updateOpportunity);
router.delete("/:id", requireAuth, requireNGO, deleteOpportunity);

export default router;
