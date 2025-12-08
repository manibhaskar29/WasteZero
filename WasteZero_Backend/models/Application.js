import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // form fields
    name: String,
    email: String,
    phone: String,
    location: String,
    experience: String,
    skills: [String],
    availability: String,
    motivation: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    }

  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
