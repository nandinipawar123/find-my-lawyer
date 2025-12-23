const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const rbac = require('../middlewares/rbac');

// Get all pending lawyers
router.get('/pending-lawyers', auth, rbac(['ADMIN']), adminController.getPendingLawyers);
// Approve or reject lawyer
router.post('/review-lawyer', auth, rbac(['ADMIN']), adminController.reviewLawyer);

module.exports = router;
