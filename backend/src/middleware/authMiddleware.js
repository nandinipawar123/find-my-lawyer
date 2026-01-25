const jwt = require("jsonwebtoken");

/**
 * Protect routes – verifies JWT
 */
exports.protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecretkey_dev_only"
    );

    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

/**
 * Role based access control
 */
exports.isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

exports.isLawyer = (req, res, next) => {
  if (req.user.role !== "lawyer") {
    return res.status(403).json({ message: "Lawyer access only" });
  }
  next();
};
