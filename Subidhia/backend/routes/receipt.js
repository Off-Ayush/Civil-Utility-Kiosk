/**
 * Receipt Routes
 * Endpoints for sending payment receipts
 */

const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');
const auth = require('../middleware/auth');

// Send receipt to email
router.post('/send-email', auth, receiptController.sendReceiptEmail);

// Send receipt SMS
router.post('/send-sms', auth, receiptController.sendReceiptSMS);

// Generate PDF (optional - handled client-side)
router.post('/generate-pdf', auth, receiptController.generatePDF);

module.exports = router;
