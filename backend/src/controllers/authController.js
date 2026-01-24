const User = require("../models/User");
const LawyerProfile = require("../models/LawyerProfile");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const twilioService = require("../utils/twilio");

/* SEND OTP */
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  await twilioService.sendOTP(phone);
  res.json({ message: "OTP sent" });
};

/* VERIFY OTP */
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  const verified = await twilioService.verifyOTP(phone, otp);
  if (!verified) return res.status(400).json({ message: "Invalid OTP" });
  res.json({ message: "OTP verified" });
};

/* REGISTER LAWYER */
exports.registerLawyer = async (req, res) => {
  try {
    const { name, email, password, phone, enrollmentNumber } = req.body;

    if (!name || !email || !password || !phone || !enrollmentNumber) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "lawyer",
    });

    await LawyerProfile.create({
      user: user._id,
      enrollmentNumber,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Lawyer registered successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/* LOGIN */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id, user.role),
    user
  });
};
