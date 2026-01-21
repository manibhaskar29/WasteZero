// Middleware to check if user is NGO or Admin
export default function requireNGOOrAdmin(req, res, next) {
  if (!req.user || (req.user.role !== "ngo" && req.user.role !== "admin")) {
    return res.status(403).json({
      message: "Access denied. Only NGOs and Admins can perform this action.",
    });
  }
  next();
}
