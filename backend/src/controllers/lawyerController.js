const supabase = require('../config/supabase');
const path = require('path');

// @desc    Upload Lawyer Certificate
// @route   POST /api/lawyers/upload-certificate
// @access  Private (Lawyer)
const uploadCertificate = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = req.files.file;
        
        // Backend Validation: Type and Size
        if (file.mimetype !== 'application/pdf') {
            return res.status(400).json({ message: 'Only PDF files are allowed' });
        }

        if (file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ message: 'File size exceeds 5MB limit' });
        }

        const userId = req.user.id;
        const fileExt = path.extname(file.name);
        const fileName = `${userId}_${Date.now()}${fileExt}`;
        const filePath = `certificates/${fileName}`;

        // 1. Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
            .from('lawyer-assets')
            .upload(filePath, file.data, {
                contentType: file.mimetype,
                upsert: true
            });

        if (uploadError) {
            console.error('Supabase Storage Error:', uploadError);
            return res.status(500).json({ message: 'Error uploading to storage' });
        }

        // 2. Get Public URL
        const { data: { publicUrl } } = supabase.storage
            .from('lawyer-assets')
            .getPublicUrl(filePath);

        // 3. Update Lawyer Profile
        const { error: dbError } = await supabase
            .from('lawyer_profiles')
            .update({ 
                certificate_url: publicUrl,
                status: 'PENDING_VERIFICATION' 
            })
            .eq('user_id', userId);

        if (dbError) {
            console.error('DB Update Error:', dbError);
            return res.status(500).json({ message: 'Error updating profile' });
        }

        res.json({ message: 'Certificate uploaded successfully', certificateUrl: publicUrl });
    } catch (error) {
        console.error('Upload catch error:', error);
        res.status(500).json({ message: 'Server Error during upload' });
    }
};

// ... existing code for getPendingLawyers, verifyLawyer, updateProfile ...
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
