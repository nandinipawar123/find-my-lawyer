const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  uploadCertificate,
  updateProfile,
} = require("../controllers/lawyerController");

const { protect } = require("../middleware/authMiddleware");

const upload = multer({ storage: multer.memoryStorage() });

// Lawyer Routes
router.post(
  "/upload-certificate",
  protect,
  upload.single("certificate"),
  uploadCertificate
);

router.put("/update-profile", protect, updateProfile);

module.exports = router;
