const LawyerProfile = require('../models/LawyerProfile');
const User = require('../models/User');

// @desc    Upload Lawyer Certificate
// @route   POST /api/lawyers/upload-certificate
// @access  Private (Lawyer)
const uploadCertificate = async (req, res) => {
    // Mock File Upload (Multer middleware usually handles this)
    // Assuming req.file.path or similar would exist if cloudinary/multer was set up
    // For MVP, we'll accept a 'fake' URL in body or assume a file path from a mock middleware

    try {
        const userId = req.user._id;
        // In a real scenario, use Cloudinary url
        const certificateUrl = req.body.certificateUrl || 'https://via.placeholder.com/certificate.pdf';

        const profile = await LawyerProfile.findOne({ user: userId });

        if (!profile) {
            return res.status(404).json({ message: 'Lawyer profile not found' });
        }

        profile.certificateUrl = certificateUrl;
        await profile.save();

        res.json({ message: 'Certificate uploaded successfully', certificateUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get Pending Lawyers (Admin)
// @route   GET /api/lawyers/pending
// @access  Private (Admin)
const getPendingLawyers = async (req, res) => {
    try {
        const profiles = await LawyerProfile.find({ status: 'PENDING_VERIFICATION' }).populate('user', 'name email phone');
        res.json(profiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve/Reject Lawyer
// @route   PUT /api/lawyers/verify/:id
// @access  Private (Admin)
const verifyLawyer = async (req, res) => {
    const { status, authorizedRate } = req.body; // status: 'VERIFIED' or 'REJECTED'
    const profileId = req.params.id;

    try {
        const profile = await LawyerProfile.findById(profileId);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (status) profile.status = status;
        if (authorizedRate) profile.authorizedRate = authorizedRate;

        await profile.save();

        res.json({ message: `Lawyer ${status.toLowerCase()} successfully`, profile });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update Lawyer Profile (Bio/Expertise)
// @route   PUT /api/lawyers/profile
// @access  Private (Lawyer)
const updateProfile = async (req, res) => {
    const { bio, expertise } = req.body;

    try {
        const profile = await LawyerProfile.findOne({ user: req.user._id });

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Only allow if verified
        if (profile.status !== 'VERIFIED') {
            return res.status(403).json({ message: 'Account not verified yet' });
        }

        if (bio) profile.bio = bio;
        if (expertise) profile.expertise = expertise; // Array of strings

        await profile.save();
        res.json(profile);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    uploadCertificate,
    getPendingLawyers,
    verifyLawyer,
    updateProfile
};
