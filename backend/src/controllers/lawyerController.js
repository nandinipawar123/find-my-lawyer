const { eq } = require('drizzle-orm');
const { db, profiles, lawyerProfiles } = require('../db');

// @desc    Upload Lawyer Certificate
// @route   POST /api/lawyers/upload-certificate
// @access  Private (Lawyer)
const uploadCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const certificateUrl = req.body.certificateUrl || 'https://via.placeholder.com/certificate.pdf';

        const [profile] = await db.update(lawyerProfiles)
            .set({ certificateUrl, updatedAt: new Date() })
            .where(eq(lawyerProfiles.userId, userId))
            .returning();

        if (!profile) {
            return res.status(404).json({ message: 'Lawyer profile not found' });
        }

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
        const pendingLawyers = await db.select({
            id: lawyerProfiles.id,
            userId: lawyerProfiles.userId,
            enrollmentNumber: lawyerProfiles.enrollmentNumber,
            certificateUrl: lawyerProfiles.certificateUrl,
            status: lawyerProfiles.status,
            authorizedRate: lawyerProfiles.authorizedRate,
            bio: lawyerProfiles.bio,
            expertise: lawyerProfiles.expertise,
            createdAt: lawyerProfiles.createdAt,
            fullName: profiles.fullName,
            phone: profiles.phone,
            email: profiles.email,
        })
        .from(lawyerProfiles)
        .leftJoin(profiles, eq(lawyerProfiles.userId, profiles.id))
        .where(eq(lawyerProfiles.status, 'PENDING_VERIFICATION'));

        const enrichedProfiles = pendingLawyers.map(lawyer => ({
            ...lawyer,
            user: {
                full_name: lawyer.fullName,
                phone: lawyer.phone,
                email: lawyer.email
            }
        }));

        res.json(enrichedProfiles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Approve/Reject Lawyer
// @route   PUT /api/lawyers/verify/:id
// @access  Private (Admin)
const verifyLawyer = async (req, res) => {
    const { status, authorizedRate } = req.body;
    const profileId = req.params.id;

    try {
        const updates = { updatedAt: new Date() };
        if (status) updates.status = status;
        if (authorizedRate !== undefined) updates.authorizedRate = authorizedRate;

        const [profile] = await db.update(lawyerProfiles)
            .set(updates)
            .where(eq(lawyerProfiles.id, profileId))
            .returning();

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        const message = status 
            ? `Lawyer ${status.toLowerCase()} successfully` 
            : 'Lawyer profile updated successfully';
        res.json({ message, profile });
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
        const [profile] = await db.select()
            .from(lawyerProfiles)
            .where(eq(lawyerProfiles.userId, req.user.id))
            .limit(1);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.status !== 'VERIFIED') {
            return res.status(403).json({ message: 'Account not verified yet' });
        }

        const updates = { updatedAt: new Date() };
        if (bio) updates.bio = bio;
        if (expertise) updates.expertise = expertise;

        const [updatedProfile] = await db.update(lawyerProfiles)
            .set(updates)
            .where(eq(lawyerProfiles.userId, req.user.id))
            .returning();

        res.json(updatedProfile);
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
