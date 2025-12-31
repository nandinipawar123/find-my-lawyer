const supabase = require('../config/supabase');
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

    // Use Supabase Admin API to create user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone, role }
    });

    if (authError) {
      return res.status(400).json({ message: authError.message });
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        full_name: name,
        email: email,
        phone,
        role,
        is_phone_verified: false
      });

    if (profileError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ message: profileError.message });
    }

    if (role === 'lawyer') {
      const { error: lawyerError } = await supabase
        .from('lawyer_profiles')
        .insert({
          user_id: authData.user.id,
          enrollment_number: enrollmentNumber,
          status: 'PENDING_VERIFICATION'
        });

      if (lawyerError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        return res.status(400).json({ message: lawyerError.message });
      }
    }

    // SMS logic remains separate but triggered
    const { sendOtp } = require('../utils/sms');
    await sendOtp(phone);

    res.status(201).json({
      _id: authData.user.id,
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
  const { verifyOtpCode } = require('../utils/sms');

  try {
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('phone, full_name, role')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError || !profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isVerified = await verifyOtpCode(profile.phone, otp);

    if (isVerified) {
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({ is_phone_verified: true })
        .eq('id', userId)
        .select()
        .single();

      if (updateError) return res.status(500).json({ message: updateError.message });

      const { data: { user } } = await supabase.auth.admin.getUserById(userId);

      res.json({
        _id: user.id,
        name: updatedProfile.full_name,
        email: user.email,
        role: updatedProfile.role,
        token: generateToken(user.id, updatedProfile.role),
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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(400).json({ message: 'Profile not found' });
    }

    res.json({
      _id: authData.user.id,
      name: profile.full_name,
      email: authData.user.email,
      role: profile.role,
      isPhoneVerified: profile.is_phone_verified,
      token: generateToken(authData.user.id, profile.role),
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
