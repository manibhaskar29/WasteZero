import mongoose from "mongoose";

const OpportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    skills: { type: [String], default: [] },
    duration: { type: String },
    status: {
      type: String,
      enum: ["Open", "In-Progress", "Closed"],
      default: "Open",
    },
    startDate: { type: String },
    endDate: { type: String },

    // who created this?
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);

const Opportunity = mongoose.model("Opportunity", OpportunitySchema);

export default Opportunity;
