const supabase = require("../config/supabase");

// ================================
// GET PENDING LAWYERS
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
        users (
          name,
          email,
          phone
        )
      `)
      .eq("status", "PENDING_VERIFICATION");

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================================
// APPROVE / REJECT
// ================================
exports.reviewLawyer = async (req, res) => {
  try {
    const { lawyerId, status, admin_comment } = req.body;

    if (!["VERIFIED", "REJECTED"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    await supabase
      .from("lawyer_profiles")
      .update({
        status,
        admin_comment,
        verified_at: status === "VERIFIED" ? new Date() : null,
      })
      .eq("id", lawyerId);

    res.json({ message: `Lawyer ${status.toLowerCase()} successfully` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
