const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/findmylawyer');

        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@findmylawyer.com' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt); // Default password

        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@findmylawyer.com',
            password: hashedPassword,
            phone: '0000000000',
            role: 'admin',
            isPhoneVerified: true,
        });

        console.log('Admin user created:', admin.email);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();
