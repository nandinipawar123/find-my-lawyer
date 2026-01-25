const supabase = require("../config/supabase");

// ================================
// UPLOAD CERTIFICATE
// ================================
exports.uploadCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const ext = req.file.originalname.split(".").pop();
    const path = `lawyers/${userId}/certificate.${ext}`;

    await supabase.storage
      .from("lawyer-certificates")
      .upload(path, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    await supabase
      .from("lawyer_profiles")
      .update({
        certificate_url: path,
        status: "PENDING_VERIFICATION",
      })
      .eq("user_id", userId);

    res.json({ message: "Certificate uploaded successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// UPDATE PROFILE
// ================================
exports.updateProfile = async (req, res) => {
  try {
    const { bio, expertise } = req.body;

    await supabase
      .from("lawyer_profiles")
      .update({ bio, expertise })
      .eq("user_id", req.user.id);

    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
