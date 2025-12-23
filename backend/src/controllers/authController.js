const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// @desc    Register a new user (Client or Lawyer)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, enrollmentNumber } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      isPhoneVerified: false, // Default to false, waiting for OTP
    });

    if (user) {
      // If Lawyer, create profile
      if (role === 'lawyer') {
        if (!enrollmentNumber) {
          // Rollback if needed, but for now just fail request? 
          // Better to check enrollmentNumber before creating user.
          // For MVP letting it slide or we can delete user.
          await User.findByIdAndDelete(user._id);
          return res.status(400).json({ message: 'Enrollment number required for lawyers' });
        }
        await LawyerProfile.create({
          user: user._id,
          enrollmentNumber,
          status: 'PENDING_VERIFICATION' // Initial status
        });
      }

      // Mock OTP Send
      console.log(`[MOCK OTP] Sending OTP to ${phone} for User ID ${user._id}`);
      // In real app: await twilioService.sendOtp(phone);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        // token: generateToken(user._id, user.role), // Don't login yet, wait for OTP
        message: 'User registered. Please verify OTP.',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body; // In real app, check OTP against phone or userId

  // MOCK OTP CHECK
  if (otp === '123456') {
    const user = await User.findById(userId);
    if (user) {
      user.isPhoneVerified = true;
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id, user.role),
        message: 'Phone verified successfully'
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } else {
    res.status(400).json({ message: 'Invalid OTP' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPhoneVerified: user.isPhoneVerified,
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  verifyOtp
};