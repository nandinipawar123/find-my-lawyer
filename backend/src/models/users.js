const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  contactNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['CLIENT', 'LAWYER', 'ADMIN'], required: true },
  isPhoneVerified: { type: Boolean, default: false },
  lawyerProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'LawyerProfile' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);