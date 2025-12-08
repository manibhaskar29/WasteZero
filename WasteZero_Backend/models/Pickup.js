import mongoose from "mongoose";

const pickupSchema = new mongoose.Schema({
  opportunityId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Opportunity", 
    required: true 
  },

  ngoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  createdBy: {   // The user who scheduled the pickup (volunteer/user)
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },

  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },

  wasteTypes: [{ type: String, required: true }],
  timeslot: { type: String },
  quantityKg: { type: Number, required: true },
  address: { type: String, required: true },
  pickupDate: { type: Date, required: true },

  status: { 
    type: String, 
    enum: ["Pending", "Approved", "Completed", "Cancelled"],
    default: "Pending" 
  },
  enrolledUsers: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userQuantityKg: Number,
    userWasteTypes: [String],
    meetingPoint: String,
    emergencyPhone: String,
    note: String,
    enrolledAt: { type: Date, default: Date.now }
  }
],


}, { timestamps: true });

const Pickup = mongoose.model("Pickup", pickupSchema);

export default Pickup;
