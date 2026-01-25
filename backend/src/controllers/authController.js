const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilioService = require("../utils/twilio");

// ===========================
// GENERATE JWT
// ===========================
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===========================
// SEND OTP
// ===========================
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: "Phone required" });

    await twilioService.sendOTP(phone);
    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// VERIFY OTP
// ===========================
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const verified = await twilioService.verifyOTP(phone, otp);
    if (!verified)
      return res.status(400).json({ message: "Invalid OTP" });

    res.json({ message: "OTP verified" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// REGISTER LAWYER
// ===========================
exports.registerLawyer = async (req, res) => {
  try {
    const { name, email, password, phone, enrollmentNumber } = req.body;

    if (!name || !email || !password || !phone || !enrollmentNumber)
      return res.status(400).json({ message: "All fields required" });

    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const { data: user } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          phone,
          password: hashed,
          role: "lawyer",
        },
      ])
      .select()
      .single();

    await supabase.from("lawyer_profiles").insert([
      {
        user_id: user.id,
        enrollment_number: enrollmentNumber,
        status: "PENDING_VERIFICATION",
      },
    ]);

    res.status(201).json({
      message: "Lawyer registered successfully",
      userId: user.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================
// LOGIN
// ===========================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
