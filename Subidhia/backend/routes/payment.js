const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get('/bills/:userId', auth, paymentController.getBills);
router.post('/initiate', auth, paymentController.initiatePayment);
router.post('/verify', auth, paymentController.verifyPayment);
router.get('/history/:userId', auth, paymentController.getPaymentHistory);

module.exports = router;
