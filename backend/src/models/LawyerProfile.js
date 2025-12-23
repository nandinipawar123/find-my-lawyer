const mongoose = require('mongoose');

const lawyerProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  certificateUrl: {
    type: String,
    // required: true, // Making optional for initial creation step if multiphase
  },
  status: {
    type: String,
    enum: ['PENDING_VERIFICATION', 'VERIFIED', 'REJECTED'],
    default: 'PENDING_VERIFICATION',
  },
  authorizedRate: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
  },
  expertise: [{
    type: String, // Can be later linked to Category model
  }],
}, { timestamps: true });

module.exports = mongoose.model('LawyerProfile', lawyerProfileSchema);
