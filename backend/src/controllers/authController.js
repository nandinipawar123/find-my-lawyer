const supabase = require("../config/supabase");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilioService = require("../utils/twilio");

// ===============================
// GENERATE JWT
// ===============================
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ===============================
// SEND OTP
// ===============================
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    await twilioService.sendOTP(phone);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ===============================
// VERIFY OTP
// ===============================
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const verified = await twilioService.verifyOTP(phone, otp);

    if (!verified) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed" });
  }
};

// ===============================
// REGISTER USER / LAWYER
// ===============================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, enrollmentNumber } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          name,
          email,
          phone,
          password: hashedPassword,
          role: enrollmentNumber ? "lawyer" : "client",
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // If lawyer → create profile
    if (enrollmentNumber) {
      await supabase.from("lawyer_profiles").insert([
        {
          user_id: user.id,
          enrollment_number: enrollmentNumber,
          status: "PENDING",
        },
      ]);
    }

    const token = generateToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// ===============================
// LOGIN USER (WITH SUPABASE LOG)
// ===============================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ STORE LOGIN INFO IN SUPABASE
    await supabase
      .from("users")
      .update({
        last_login: new Date(),
        login_ip: req.ip,
      })
      .eq("id", user.id);

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};
