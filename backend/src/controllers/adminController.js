const supabase = require("../config/supabase");

// ================================
// GET ALL PENDING LAWYERS
// ================================
exports.getPendingLawyers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("lawyer_profiles")
      .select(`
        id,
        enrollment_number,
        certificate_url,
        status,
        admin_comment,
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .eq("status", "PENDING_VERIFICATION");

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// APPROVE / REJECT LAWYER
// ================================
exports.reviewLawyer = async (req, res) => {
  try {
    const { lawyerId, status, admin_comment } = req.body;

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const { error } = await supabase
      .from("lawyer_profiles")
      .update({
        status,
        admin_comment: admin_comment || null,
        verified_at: status === "VERIFIED" ? new Date() : null,
      })
      .eq("id", lawyerId);

    if (error) throw error;

    res.json({
      message: `Lawyer ${status.toLowerCase()} successfully`,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// PUBLIC – GET VERIFIED LAWYERS
// ================================
exports.getVerifiedLawyers = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("lawyer_profiles")
      .select(`
        id,
        bio,
        expertise,
        authorized_rate,
        profiles (
          full_name,
          phone
        )
      `)
      .eq("status", "VERIFIED");

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
