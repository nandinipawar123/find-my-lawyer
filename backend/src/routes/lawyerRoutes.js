const express = require('express');
const router = express.Router();
const { uploadCertificate, getPendingLawyers, verifyLawyer, updateProfile } = require('../controllers/lawyerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Lawyer Routes
router.post('/upload-certificate', protect, authorize('lawyer'), uploadCertificate);
router.put('/profile', protect, authorize('lawyer'), updateProfile);

// Admin Routes
router.get('/pending', protect, authorize('admin'), getPendingLawyers);
router.put('/verify/:id', protect, authorize('admin'), verifyLawyer);

module.exports = router;
