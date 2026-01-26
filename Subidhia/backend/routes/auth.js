const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { registrationValidation, loginValidation, aadhaarValidation } = require('../middleware/validation');
const { uploadProfile, uploadDocument, handleMulterError } = require('../config/multerConfig');

// Public routes
router.post('/register', uploadProfile.single('profilePhoto'), registrationValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.post('/verify-aadhaar', aadhaarValidation, authController.verifyAadhaar);
router.post('/verify-otp', authController.verifyOTP);
router.post('/logout', authController.logout);

// Protected routes (require authentication)
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/upload-document', authMiddleware, uploadDocument.single('document'), handleMulterError, authController.uploadDocument);

module.exports = router;
