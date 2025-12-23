const User = require('../models/User');
const LawyerProfile = require('../models/LawyerProfile');

// Get all pending lawyers
exports.getPendingLawyers = async (req, res) => {
  const pending = await LawyerProfile.find({ status: 'PENDING_VERIFICATION' }).populate('user');
  res.json(pending);
};

// Approve or Reject Lawyer
exports.reviewLawyer = async (req, res) => {
  const { lawyerProfileId, action, authorizedRate } = req.body;
  try {
    const profile = await LawyerProfile.findById(lawyerProfileId);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    if (action === 'APPROVE') {
      profile.status = 'VERIFIED';
      profile.authorizedRate = authorizedRate;
    } else if (action === 'REJECT') {
      profile.status = 'REJECTED';
    }
    await profile.save();
    res.json({ message: `Lawyer ${action.toLowerCase()}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};