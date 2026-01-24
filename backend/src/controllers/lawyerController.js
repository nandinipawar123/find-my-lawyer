const LawyerProfile = require('../models/LawyerProfile');
const supabase = require('../config/supabase');

/* ========================================
   UPLOAD CERTIFICATE (LAWYER)
======================================== */
exports.uploadCertificate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user._id.toString();
    const ext = req.file.originalname.split('.').pop();
    const filePath = `lawyers/${userId}/certificate.${ext}`;

    const { error } = await supabase.storage
      .from('lawyer-certificates')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) throw error;

    const profile = await LawyerProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: 'Lawyer profile not found' });
    }

    profile.certificateUrl = filePath;
    profile.status = 'pending';
    profile.adminComment = null;
    profile.verifiedAt = null;

    await profile.save();

    res.json({
      message: 'Certificate uploaded. Verification pending.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed' });
  }
};

/* ========================================
   ADMIN – GET PENDING LAWYERS
======================================== */
exports.getPendingLawyers = async (req, res) => {
  try {
    const lawyers = await LawyerProfile.find({ status: 'pending' })
      .populate('user', 'name email phone');

    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ========================================
   ADMIN – VERIFY / REJECT LAWYER
======================================== */
exports.verifyLawyer = async (req, res) => {
  const { status, adminComment, authorizedRate } = req.body;
  const { id } = req.params;

  if (!['verified', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const profile = await LawyerProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }

    profile.status = status;
    profile.adminComment = adminComment || null;
    profile.verifiedAt = status === 'verified' ? new Date() : null;

    if (authorizedRate) {
      profile.authorizedRate = authorizedRate;
    }

    await profile.save();

    res.json({
      message: `Lawyer ${status} successfully`,
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/* ========================================
   LAWYER – UPDATE PROFILE
======================================== */
exports.updateProfile = async (req, res) => {
  const { bio, expertise } = req.body;

  try {
    const profile = await LawyerProfile.findOne({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    if (profile.status !== 'verified') {
      return res.status(403).json({
        message: 'Your account is not verified yet',
      });
    }

    if (bio) profile.bio = bio;
    if (expertise) profile.expertise = expertise;

    await profile.save();

    res.json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
