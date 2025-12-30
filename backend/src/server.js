require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all origins in dev
    credentials: true
}));

// Basic Route
app.get('/', (req, res) => {
    res.send('FindMyLawyer API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const lawyerRoutes = require('./routes/lawyerRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/lawyers', lawyerRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});