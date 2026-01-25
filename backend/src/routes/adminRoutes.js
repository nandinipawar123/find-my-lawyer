const express = require("express");
const router = express.Router();

const {
  getPendingLawyers,
  reviewLawyer,
  getVerifiedLawyers,
} = require("../controllers/adminController");

const { protect, isAdmin } = require("../middleware/authMiddleware");

// ADMIN ONLY
router.get("/pending-lawyers", protect, isAdmin, getPendingLawyers);
router.put("/review-lawyer", protect, isAdmin, reviewLawyer);

// PUBLIC
router.get("/verified-lawyers", getVerifiedLawyers);

module.exports = router;
