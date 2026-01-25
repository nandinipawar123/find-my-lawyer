const express = require("express");
const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  registerLawyer,
  loginUser,
} = require("../controllers/authController");

// Auth routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", registerLawyer);
router.post("/login", loginUser);

module.exports = router;
