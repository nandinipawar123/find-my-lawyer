const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// ======================
// MIDDLEWARE
// ======================
app.use(express.json());
app.use(cors());

// ======================
// DATABASE
// ======================
connectDB();

// ======================
// ROUTES (IMPORT FIRST)
// ======================
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/admin");

// ======================
// ROUTES (USE AFTER IMPORT)
// ======================
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// ======================
// TEST ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ======================
// SERVER
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
