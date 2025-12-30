const bcrypt = require('bcryptjs');
const { eq } = require('drizzle-orm');
const { db, profiles, lawyerProfiles } = require('../db');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user (Client or Lawyer)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, enrollmentNumber } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    if (role === 'lawyer' && !enrollmentNumber) {
      return res.status(400).json({ message: 'Enrollment number required for lawyers' });
    }

    const existingUser = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const [newProfile] = await db.insert(profiles).values({
      email,
      passwordHash,
      fullName: name,
      phone,
      role,
      isPhoneVerified: false
    }).returning();

    if (role === 'lawyer') {
      await db.insert(lawyerProfiles).values({
        userId: newProfile.id,
        enrollmentNumber,
        status: 'PENDING_VERIFICATION'
      });
    }

    console.log(`[MOCK OTP] Sending OTP to ${phone} for User ID ${newProfile.id}`);

    res.status(201).json({
      _id: newProfile.id,
      name,
      email,
      role,
      isPhoneVerified: false,
      message: 'User registered. Please verify OTP.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    if (otp === '123456') {
      const [updatedProfile] = await db.update(profiles)
        .set({ isPhoneVerified: true, updatedAt: new Date() })
        .where(eq(profiles.id, userId))
        .returning();

      if (!updatedProfile) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        _id: updatedProfile.id,
        name: updatedProfile.fullName,
        email: updatedProfile.email,
        role: updatedProfile.role,
        token: generateToken(updatedProfile.id, updatedProfile.role),
        message: 'Phone verified successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [profile] = await db.select().from(profiles).where(eq(profiles.email, email)).limit(1);

    if (!profile) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, profile.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: profile.id,
      name: profile.fullName,
      email: profile.email,
      role: profile.role,
      isPhoneVerified: profile.isPhoneVerified,
      token: generateToken(profile.id, profile.role),
    });
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
