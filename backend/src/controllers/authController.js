const supabase = require('../config/supabase');
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

    console.log(`[MOCK OTP] Sending OTP to ${phone} for User ID ${authData.user.id}`);

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

  if (otp === '123456') {
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ is_phone_verified: true })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error || !profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { data: { user } } = await supabase.auth.admin.getUserById(userId);

    res.json({
      _id: user.id,
      name: profile.full_name,
      email: user.email,
      role: profile.role,
      token: generateToken(user.id, profile.role),
      message: 'Phone verified successfully'
    });
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