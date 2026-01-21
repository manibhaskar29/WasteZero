import express from "express";
import requireAuth from "../middlewares/authMiddleware.js";
import requireNGOOrAdmin from "../middlewares/roleCheck.js";
import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import authMiddleware from "../middlewares/authMiddleware.js";


import {
  getAllOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunity.controller.js";

const router = express.Router();

// Public routes - anyone can view opportunities
router.get("/", getAllOpportunities);
router.get("/:id", getOpportunityById);

// Protected routes - NGOs and Admins can create/edit/delete
router.post("/", requireAuth, requireNGOOrAdmin, createOpportunity);
router.put("/:id", requireAuth, requireNGOOrAdmin, updateOpportunity);
router.delete("/:id", requireAuth, requireNGOOrAdmin, deleteOpportunity);
// Apply for an opportunity - Only regular users can apply
router.post("/:id/apply", authMiddleware, async (req, res) => {
  try {
    // Only regular users can apply (not NGOs or Admins)
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only regular users can apply to opportunities. NGOs and Admins cannot apply."
      });
    }

    const { id } = req.params;

    const opportunity = await Opportunity.findById(id);
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    const application = await Application.create({
      opportunityId: id,
      ngoId: opportunity.createdBy, // NGO who posted the opportunity
      userId: req.user._id,
      ...req.body,
    });

    res.json({ message: "Application submitted", application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all applications for NGOs
router.get("/ngo/applications", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ngo")
      return res.status(403).json({ message: "Unauthorized" });

    const apps = await Application.find({ ngoId: req.user.sub })

      .populate("userId", "firstName lastName email")
      .populate("opportunityId", "title location");


    res.json(apps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update application status (accept or reject)
router.patch("/applications/:id/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ngo")
      return res.status(403).json({ message: "Unauthorized" });

    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(app);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




export default router;
