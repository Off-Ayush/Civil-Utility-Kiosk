const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.getBills = async (req, res) => {
    try {
        const { userId } = req.params;

        // Placeholder - fetch from database in production
        const bills = [
            {
                billId: 'BILL001',
                amount: 2450,
                dueDate: '2026-01-25',
                status: 'pending',
                consumption: '245 kWh',
                billingPeriod: 'Dec 2025'
            }
        ];

        res.json({ success: true, bills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.initiatePayment = async (req, res) => {
    try {
        const { amount, billId, userId } = req.body;

        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: `rcpt_${billId}_${Date.now()}`,
            notes: {
                billId,
                userId
            }
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, billId } = req.body;

        const crypto = require('crypto');
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Update bill status in database
            res.json({
                success: true,
                message: 'Payment verified successfully',
                transactionId: razorpay_payment_id
            });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPaymentHistory = async (req, res) => {
    try {
        const { userId } = req.params;

        // Placeholder - fetch from database in production
        const history = [
            {
                transactionId: 'TXN123456',
                amount: 2180,
                date: '2025-12-15',
                status: 'success',
                billId: 'BILL001'
            }
        ];

        res.json({ success: true, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
