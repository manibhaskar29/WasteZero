import Pickup from "../models/Pickup.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";
import User from "../models/user.js";   

/* -------------------------------------------------
   CREATE PICKUP  (NGO or ADMIN)
-------------------------------------------------- */
export const createPickup = async (req, res) => {
  try {
    if (req.user.role !== "ngo" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pickup = await Pickup.create({
      createdBy: req.user.sub,
      ...req.body,
    });

    /* ⭐ SEND NOTIFICATION TO ALL ADMINS */
    const admins = await User.find({ role: "admin" }).select("_id");

    if (admins.length > 0) {
      const notifications = admins.map(admin =>
        Notification.create({
          recipient: admin._id,
          sender: req.user.sub,
          type: "pickup_created",
          title: "New Pickup Created",
          message: `A new pickup was created by ${req.user.firstName || req.user.email}`,
        })
      );

      await Promise.all(notifications);
    }

    res.status(201).json(pickup);
  } catch (err) {
    console.error("Create Pickup Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------
   GET ALL PICKUPS + USER APPLICATION STATUS
-------------------------------------------------- */
export const getPickupHistory = async (req, res) => {
  try {
    const userId = req.user.sub;

    const pickups = await Pickup.find()
      .populate("createdBy", "firstName lastName role")
      .populate("ngoId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    const apps = await Application.find({ userId }).lean();

    const enriched = pickups.map((p) => {
      const app = apps.find(
        (a) =>
          a.opportunityId?.toString() === p.opportunityId?.toString()
      );

      return {
        ...p,
        applicationStatus: app?.status || "none",
      };
    });

    res.json(enriched);
  } catch (err) {
    console.error("Get Pickup History Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------
   ADMIN UPDATE PICKUP
-------------------------------------------------- */
export const updatePickup = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    pickup.status = req.body.status;
    await pickup.save();

    /* ⭐ SEND NOTIFICATION TO NGO */
    await Notification.create({
      recipient: pickup.createdBy,
      sender: req.user.sub,
      type: "pickup_update",
      title: "Pickup Updated",
      message: `Your pickup status was updated to: ${req.body.status}`,
    });

    res.json(pickup);
  } catch (err) {
    console.error("Update Pickup Error:", err);
    res.status(500).json({ error: err.message });
  }
};

/* -------------------------------------------------
   ENROLL USER
-------------------------------------------------- */
export const enrollInPickup = async (req, res) => {
  try {
    const userId = req.user.sub;
    const {
      userQuantityKg,
      userWasteTypes,
      meetingPoint,
      emergencyPhone,
      note,
    } = req.body;

    const pickup = await Pickup.findById(req.params.id);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    const application = await Application.findOne({
      userId,
      ngoId: pickup.ngoId,
      opportunityId: pickup.opportunityId,
      status: "accepted",
    });

    if (!application) {
      return res.status(403).json({
        message: "You cannot enroll — your application was not accepted.",
      });
    }

    if (pickup.enrolledUsers.some((u) => u.userId.toString() === userId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    pickup.enrolledUsers.push({
      userId,
      userQuantityKg,
      userWasteTypes,
      meetingPoint,
      emergencyPhone,
      note,
      enrolledAt: new Date(),
    });

    await pickup.save();

    /* ⭐ SEND NOTIFICATION TO NGO */
    await Notification.create({
      recipient: pickup.createdBy,
      sender: req.user.sub,
      type: "pickup_enrollment",
      title: "User Enrolled",
      message: "A user has enrolled in your pickup.",
    });

    res.json({ message: "Enrolled successfully", pickup });
  } catch (err) {
    console.error("Enroll Pickup Error:", err);
    res.status(500).json({ error: err.message });
  }
};
