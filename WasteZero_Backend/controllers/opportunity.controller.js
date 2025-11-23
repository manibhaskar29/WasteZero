import Opportunity from "../models/Opportunity.js";

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
    const op = await Opportunity.create({
      ...req.body,
      createdBy: req.user.sub, // auth middleware sets req.user
    });

    res.status(201).json(op);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE opportunity (NGO only)
export const updateOpportunity = async (req, res) => {
  try {
    const op = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );

    if (!op)
      return res.status(404).json({
        message: "Opportunity not found or you are not authorized",
      });

    res.json(op);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE opportunity
export const deleteOpportunity = async (req, res) => {
  try {
    const op = await Opportunity.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
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
