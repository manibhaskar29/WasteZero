import Opportunity from "../models/Opportunity.js";
import { createNewEventNotification } from "../controllers/notficationController.js";
import User from "../models/user.js";

// GET all opportunities
export const getAllOpportunities = async (req, res) => {
  try {
    const ops = await Opportunity.find().sort({ createdAt: -1 });
    res.json(ops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET one opportunity
export const getOpportunityById = async (req, res) => {
  try {
    const op = await Opportunity.findById(req.params.id);
    if (!op) return res.status(404).json({ message: "Opportunity not found" });

    res.json(op);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE opportunity (NGO only)
export const createOpportunity = async (req, res) => {
  try {
    // req.user.sub → logged-in NGO id
    const ngoId = req.user.sub;

    // Fetch NGO data (for ngoName)
    const ngo = await User.findById(ngoId).select("name organizationName");
    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    const op = await Opportunity.create({
      ...req.body,
      createdBy: ngoId,
    });

    // 🔔 CREATE NOTIFICATION FOR ALL USERS
    await createNewEventNotification({
      eventId: op._id,
      eventTitle: op.title,
      ngoName: ngo.organizationName || ngo.name,
      ngoId: ngoId,
      location: op.location,
      date: op.date,
    });

    res.status(201).json({
      success: true,
      message: "Opportunity created and notifications sent!",
      data: op
    });

  } catch (err) {
    console.error("Error creating opportunity:", err);
    res.status(500).json({ error: err.message });
  }
};


// UPDATE opportunity (NGO only)
export const updateOpportunity = async (req, res) => {
  try {
    const op = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.sub }, // ✅ use req.params.id and req.user.id
      req.body,
      { new: true }
    );

    if (!op) {
      return res.status(404).json({
        message: "Opportunity not found or you are not authorized",
      });
    }

    res.json(op);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// DELETE opportunity
export const deleteOpportunity = async (req, res) => {
  try {
    const op = await Opportunity.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.sub,
    });

    if (!op)
      return res.status(404).json({
        message: "Opportunity not found or unauthorized",
      });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
