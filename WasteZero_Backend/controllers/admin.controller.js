import User from "../models/user.js";

/* -------------------------------------------------
   USER MANAGEMENT
---------------------------------------------------*/

// 📌 Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: { $in: ["user", "admin"] }
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};


// 📌 Update user (name, email, role)
export const updateUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true }
    ).select("-password");

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

// 📌 Suspend / Unsuspend user
export const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.isSuspended = !user.isSuspended;
    await user.save();

    res.json({ message: `User ${user.isSuspended ? "suspended" : "restored"}` });
  } catch (err) {
    res.status(500).json({ message: "Failed to suspend user" });
  }
};

// 📌 Delete user (admin)
export const deleteUserAdmin = async (req, res) => {
  try {
    // prevent self-delete
    if (req.user.sub === req.params.id) {
      return res.status(400).json({ message: "Admin cannot delete themselves" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

/* -------------------------------------------------
   NGO MANAGEMENT
---------------------------------------------------*/

// 📌 Get all NGOs
export const getAllNGOs = async (req, res) => {
  try {
    const ngos = await User.find({ role: "ngo" }).select("-password");
    res.json(ngos);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch NGOs" });
  }
};

// 📌 Approve NGO
export const approveNGO = async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);

    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    ngo.verificationStatus = "approved";
    await ngo.save();

    res.json({ message: "NGO approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to approve NGO" });
  }
};

// 📌 Reject NGO
export const rejectNGO = async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);

    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    ngo.verificationStatus = "rejected";
    await ngo.save();

    res.json({ message: "NGO rejected successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject NGO" });
  }
};

// 📌 Disable NGO
export const disableNGO = async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);

    if (!ngo) return res.status(404).json({ message: "NGO not found" });

    ngo.isDisabled = !ngo.isDisabled;
    await ngo.save();

    res.json({
      message: `NGO ${ngo.isDisabled ? "disabled" : "enabled"} successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle NGO" });
  }
};
