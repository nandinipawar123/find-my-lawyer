const express = require("express");
const router = express.Router();

const {
  getPendingLawyers,
  reviewLawyer,
  getVerifiedLawyers,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ===============================
// ADMIN ROUTES
// ===============================

// Get all pending lawyers (ADMIN ONLY)
router.get(
  "/pending-lawyers",
  protect,
  authorize("admin"),
  getPendingLawyers
);

// Approve / Reject lawyer (ADMIN ONLY)
router.put(
  "/review-lawyer",
  protect,
  authorize("admin"),
  reviewLawyer
);

// ===============================
// PUBLIC ROUTE
// ===============================

// Get verified lawyers (for users)
router.get("/verified-lawyers", getVerifiedLawyers);

module.exports = router;
