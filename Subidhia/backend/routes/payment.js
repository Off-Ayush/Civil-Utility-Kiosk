const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.get('/bills/:userId', auth, paymentController.getBills);
router.get('/all-bills/:userId', auth, paymentController.getAllBills);
router.post('/initiate', auth, paymentController.initiatePayment);
router.post('/verify', auth, paymentController.verifyPayment);
router.post('/pay-all', auth, paymentController.payAllBills);
router.get('/history/:userId', auth, paymentController.getPaymentHistory);

module.exports = router;
