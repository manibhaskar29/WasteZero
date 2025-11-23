export default function requireNGO(req, res, next) {
  if (!req.user || req.user.role !== "ngo") {
    return res.status(403).json({
      message: "Access denied. Only NGOs can perform this action.",
    });
  }
  next();
}
