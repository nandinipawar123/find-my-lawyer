const supabase = require('../config/supabase');

// @desc    Upload Lawyer Certificate
// @route   POST /api/lawyers/upload-certificate
// @access  Private (Lawyer)
const uploadCertificate = async (req, res) => {
    try {
        const userId = req.user.id;
        const certificateUrl = req.body.certificateUrl || 'https://via.placeholder.com/certificate.pdf';

        const { data: profile, error } = await supabase
            .from('lawyer_profiles')
            .update({ certificate_url: certificateUrl })
            .eq('user_id', userId)
            .select()
            .maybeSingle();

        if (error || !profile) {
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
        const { data: profiles, error } = await supabase
            .from('lawyer_profiles')
            .select(`
                *,
                user:profiles!user_id (
                    full_name,
                    phone
                )
            `)
            .eq('status', 'PENDING_VERIFICATION');

        if (error) {
            return res.status(500).json({ message: error.message });
        }

        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const enrichedProfiles = profiles.map(profile => ({
            ...profile,
            user: {
                ...profile.user,
                email: authUsers.users.find(u => u.id === profile.user_id)?.email
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
        const updates = {};
        if (status) updates.status = status;
        if (authorizedRate !== undefined) updates.authorized_rate = authorizedRate;

        const { data: profile, error } = await supabase
            .from('lawyer_profiles')
            .update(updates)
            .eq('id', profileId)
            .select()
            .maybeSingle();

        if (error || !profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

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
        const { data: profile, error: fetchError } = await supabase
            .from('lawyer_profiles')
            .select('*')
            .eq('user_id', req.user.id)
            .maybeSingle();

        if (fetchError || !profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        if (profile.status !== 'VERIFIED') {
            return res.status(403).json({ message: 'Account not verified yet' });
        }

        const updates = {};
        if (bio) updates.bio = bio;
        if (expertise) updates.expertise = expertise;

        const { data: updatedProfile, error: updateError } = await supabase
            .from('lawyer_profiles')
            .update(updates)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (updateError) {
            return res.status(500).json({ message: updateError.message });
        }

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
