import express from "express";
import Pickup from "../models/Pickup.js";
import Opportunity from "../models/Opportunity.js";
import User from "../models/user.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import Application from "../models/Application.js";

const router = express.Router();

/* -------------------------------- USER DASHBOARD (FULL) -------------------------------- */
router.get("/user", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "user")
      return res.status(403).json({ message: "Unauthorized" });

    const userId = req.user.sub;
    const enrolledPickupsData = await Pickup.find({
      enrolledUsers: {
        $elemMatch: { userId: userId.toString() }
      }
    });


    /* -----------------------------------------------------
     * 1️⃣ PICKUPS CREATED BY USER
     ----------------------------------------------------- */
    let totalPickups = enrolledPickupsData.length;
    let totalWaste = 0;
    const wasteMap = {};

    enrolledPickupsData.forEach((p) => {
      // find the user's entry in this pickup
      const userEntry = p.enrolledUsers.find(
        (u) => u.userId.toString() === userId.toString()
      );

      if (userEntry?.userQuantityKg) {
        totalWaste += userEntry.userQuantityKg;

        (userEntry.userWasteTypes || []).forEach((type) => {
          wasteMap[type] = (wasteMap[type] || 0) + userEntry.userQuantityKg;
        });
      }
    });

    const totalCO2 = totalWaste * 1.2;

    const wasteBreakdown = Object.entries(wasteMap).map(([name, value]) => ({
      name,
      value,
    }));

    /* -----------------------------------------------------
     * 2️⃣ APPLICATION METRICS BY USER
     ----------------------------------------------------- */
    const applications = await Application.find({ userId });

    const totalApplications = applications.length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const accepted = applications.filter((a) => a.status === "accepted").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    /* -----------------------------------------------------
     * 3️⃣ ENROLLED PICKUPS
     ----------------------------------------------------- */

    const enrolled = await Pickup.find({
      enrolledUsers: {
        $elemMatch: { userId: userId.toString() }
      }
    });
    


    const totalEnrollments = enrolled.length;
    
    
    const enrolledPickups = enrolled.map((e) => {
      const userEntry = e.enrolledUsers.find(u => u.userId.toString() === userId.toString());
      return {
        pickupId: e._id,
        date: e.pickupDate,
        waste: userEntry?.userQuantityKg || 0,
        location: e.address,
        wasteTypes: userEntry?.userWasteTypes ||0,
        meetingPoint : userEntry?.meetingPoint || "",
        note : userEntry?.note || "",
      };
    });


    /* -----------------------------------------------------
     * 4️⃣ NEXT UPCOMING PICKUP
     ----------------------------------------------------- */
    const nextPickup = enrolled
      .filter((p) => new Date(p.pickupDate) > new Date())
      .sort((a, b) => new Date(a.pickupDate) - new Date(b.pickupDate))[0];
      
    const formattedNextPickup = nextPickup
      ? {
          date: nextPickup.pickupDate.toISOString().split("T")[0],
          time: nextPickup.timeslot,
          address: nextPickup.address,
          waste:nextPickup.quantityKg
        }
      : null;

    /* -----------------------------------------------------
     * 5️⃣ MONTHLY CHART (Applications + Pickups)
     ----------------------------------------------------- */
    const historyChart = [];

    enrolledPickupsData.forEach((p) => {
      const month = new Date(p.createdAt).toLocaleString("default", {
        month: "short",
      });

      const exist = historyChart.find((h) => h.month === month);
      if (exist) {
        exist.waste += p.quantityKg;
        exist.pickups += 1;
      } else {
        historyChart.push({
          month,
          waste: p.quantityKg,
          pickups: 1,
          applications: 0,
        });
      }
    });

    applications.forEach((a) => {
      const month = new Date(a.createdAt).toLocaleString("default", {
        month: "short",
      });

      const exist = historyChart.find((h) => h.month === month);
      if (exist) {
        exist.applications += 1;
      } else {
        historyChart.push({
          month,
          waste: 0,
          pickups: 0,
          applications: 1,
        });
      }
    });

    /* -----------------------------------------------------
     * 6️⃣ RECENT ACTIVITY TIMELINE
     ----------------------------------------------------- */
    const recentActivity = [
      ...enrolledPickupsData.map((p) => ({
        type: "pickup",
        status: p.status,
        date: p.createdAt,
      })),
      ...applications.map((a) => ({
        type: "application",
        status: a.status,
        date: a.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    /* -----------------------------------------------------
     * FINAL RESPONSE
     ----------------------------------------------------- */
    res.json({
      totalPickups,
      totalWaste,
      co2: totalCO2,
      wasteBreakdown,

      totalApplications,
      applicationStats: { pending, accepted, rejected },

      totalEnrollments,
      enrolledPickups,
      nextPickup: formattedNextPickup,

      historyChart,
      recentActivity,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


/* -------------------------------- NGO DASHBOARD (REAL DATA) -------------------------------- */
router.get("/ngo", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const ngoId = req.user.sub;

    /** ---------------------------------------------------------
     * 1️⃣ PICKUP METRICS
     --------------------------------------------------------- */
    const pickups = await Pickup.find({ ngoId });

    const totalPickups = pickups.length;
    const totalWaste = pickups.reduce((sum, p) => sum + (p.quantityKg || 0), 0);
    const totalCO2 = totalWaste * 1.2;

    const wasteMap = {};
    pickups.forEach((p) => {
      p.wasteTypes.forEach((t) => {
        wasteMap[t] = (wasteMap[t] || 0) + (p.quantityKg || 0);
      });
    });
    const wasteBreakdown = Object.entries(wasteMap).map(([name, value]) => ({ name, value }));

    const completedPickups = pickups.filter(p => p.status === "Completed").length;
    const pendingPickups = pickups.filter(p => p.status === "Pending").length;
    const cancelledPickups = pickups.filter(p => p.status === "Cancelled").length;

    // Monthly pickup trend
    const monthMap = {};
    pickups.forEach(p => {
      const month = new Date(p.pickupDate).toLocaleString("default", { month: "short", year: "numeric" });
      if (!monthMap[month]) monthMap[month] = { waste: 0, pickups: 0 };
      monthMap[month].waste += p.quantityKg || 0;
      monthMap[month].pickups += 1;
    });
    const pickupTrend = Object.entries(monthMap).map(([month, data]) => ({ month, ...data }));

    /** ---------------------------------------------------------
     * 2️⃣ OPPORTUNITY METRICS
     --------------------------------------------------------- */
    const opportunities = await Opportunity.find({ createdBy: ngoId });
    const activeOpportunities = opportunities.filter(o => o.status === "active").length;
    const closedOpportunities = opportunities.filter(o => o.status === "closed").length;

    /** ---------------------------------------------------------
     * 3️⃣ APPLICATION METRICS
     --------------------------------------------------------- */
    const applications = await Application.find({ ngoId });

    const totalApplicants = applications.length;
    const pending = applications.filter(a => a.status === "pending").length;
    const approved = applications.filter(a => a.status === "accepted").length;
    const rejected = applications.filter(a => a.status === "rejected").length;

    const applicantConversionRate = totalApplicants ? (approved / totalApplicants) * 100 : 0;

    // Applicant trend – last 7 applications
    const applicantChart = applications
      .slice(-7)
      .map(a => ({ date: new Date(a.createdAt).toLocaleDateString(), count: 1 }));

    // Applications per opportunity
    const applicationsPerOpportunity = opportunities.map(op => ({
      opportunityId: op._id,
      title: op.title,
      applicants: applications.filter(a => a.opportunityId.toString() === op._id.toString()).length
    }));

    /** ---------------------------------------------------------
     * 4️⃣ RECENT PICKUPS
     --------------------------------------------------------- */
    const recentPickups = pickups
      .slice(-5)
      .map(p => ({
        _id: p._id,
        wasteTypes: p.wasteTypes,
        quantityKg: p.quantityKg,
        address: p.address,
        pickupDate: p.pickupDate,
        status: p.status,
        enrolledCount: p.enrolledUsers?.length || 0,
        timeslot: p.timeslot || "-",
        ngoNote: p.note || "-"
      }));

    /** ---------------------------------------------------------
     * FINAL RESPONSE
     --------------------------------------------------------- */
    res.json({
      // Applications
      totalApplicants,
      pending,
      approved,
      rejected,
      applicantConversionRate: applicantConversionRate.toFixed(2),
      applicantChart,
      applicationsPerOpportunity,

      // Opportunities
      opportunities: opportunities.length,
      activeOpportunities,
      closedOpportunities,

      // Pickups
      totalPickups,
      totalWaste,
      totalCO2,
      wasteBreakdown,
      completedPickups,
      pendingPickups,
      cancelledPickups,
      pickupTrend,
      recentPickups
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




/* -------------------------------- ADMIN DASHBOARD -------------------------------- */
router.get("/admin", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // -------------------------------------------------
    // 1️⃣ BASIC COLLECTIONS
    // -------------------------------------------------
    const pickups = await Pickup.find();
    const users = await User.find();
    const ngos = await User.find({ role: "ngo" });
    const opportunities = await Opportunity.find();

    // -------------------------------------------------
    // 2️⃣ ENVIRONMENTAL METRICS
    // -------------------------------------------------
    const totalPickups = pickups.length;
    const totalWaste = pickups.reduce((s, p) => s + (p.quantityKg || 0), 0);
    const totalCO2 = totalWaste * 1.2;

    // Waste breakdown
    const wasteMap = {};
    pickups.forEach((p) => {
      p.wasteTypes.forEach((type) => {
        wasteMap[type] = (wasteMap[type] || 0) + (p.quantityKg || 0);
      });
    });

    const wasteBreakdown = Object.entries(wasteMap).map(([name, value]) => ({
      name,
      value,
    }));

    // -------------------------------------------------
    // 3️⃣ MONTHLY PICKUP TREND (last 6 months)
    // -------------------------------------------------
    const monthlyStats = {};
    pickups.forEach((p) => {
      const month = new Date(p.createdAt).toLocaleString("default", {
        month: "short",
      });
      monthlyStats[month] = (monthlyStats[month] || 0) + 1;
    });

    const pickupTrends = Object.entries(monthlyStats).map(([month, count]) => ({
      month,
      count,
    }));

    // -------------------------------------------------
    // 4️⃣ USER GROWTH (last 7 users)
    // -------------------------------------------------
    const userGrowth = users.slice(-7).map((u) => ({
      date: new Date(u.createdAt).toLocaleDateString(),
      count: 1,
    }));

    // -------------------------------------------------
    // 5️⃣ TOP NGOs (Based on waste collected)
    // -------------------------------------------------
    const ngoPerformanceMap = {};

    pickups.forEach((p) => {
      if (!p.ngoId) return;
      ngoPerformanceMap[p.ngoId] =
        (ngoPerformanceMap[p.ngoId] || 0) + (p.quantityKg || 0);
    });

    const topNGOs = await Promise.all(
      Object.entries(ngoPerformanceMap)
        .map(async ([ngoId, waste]) => {
          const ngo = await User.findById(ngoId);
          return {
            ngoId,
            ngoName: ngo?.name || "Unknown NGO",
            waste,
          };
        })
    );

    topNGOs.sort((a, b) => b.waste - a.waste);


    // -------------------------------------------------
    // 6️⃣ TOP USERS (Based on total waste generated)
    // -------------------------------------------------
    const topUsers = await User.find({ role: "user" })
      .sort({ totalWasteRecycled: -1 }) // descending order
      .limit(5)
      .lean();

    const formattedTopUsers = topUsers.map((u) => ({
      userId: u._id,
      name: u.name,
      totalWaste: u.totalWasteRecycled || 0,
    }));




    // -------------------------------------------------
    // 🔥 FINAL RESPONSE
    // -------------------------------------------------
    res.json({
      counts: {
        totalUsers: users.length,
        totalNGOs: ngos.length,
        totalOpportunities: opportunities.length,
        totalPickups,
      },

      environment: {
        totalWaste,
        totalCO2,
        wasteBreakdown,
      },

      trends: {
        pickupTrends,
        userGrowth,
      },

      performance: {
        topNGOs: topNGOs.slice(0, 5),  // top 5 NGOs
        topUsers: formattedTopUsers,    // top 5 users based on totalWasteRecycled
      },

      recentPickups: pickups.slice(-6),
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
