const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.getBills = async (req, res) => {
    try {
        const { userId } = req.params;
        const { serviceType } = req.query;

        if (!serviceType) {
            return res.status(400).json({
                success: false,
                message: 'Service type is required'
            });
        }

        // Service-specific bill amounts
        const serviceBillAmounts = {
            electricity: { base: 2450, consumption: '245 kWh' },
            gas: { base: 1850, consumption: '85 m³' },
            water: { base: 890, consumption: '12,500 L' },
            waste: { base: 350, consumption: 'Monthly Service' }
        };

        const billConfig = serviceBillAmounts[serviceType] || serviceBillAmounts.electricity;

        // Placeholder - fetch from database in production
        const bills = [
            {
                billId: `BILL_${serviceType.toUpperCase()}_001`,
                amount: billConfig.base,
                dueDate: '2026-02-25',
                status: 'pending',
                consumption: billConfig.consumption,
                billingPeriod: 'Jan 2026',
                serviceType: serviceType
            }
        ];

        res.json({ success: true, bills });
    } catch (error) {
        console.error('Error in getBills:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bills'
        });
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
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, billId, userId, serviceType, amount } = req.body;

        const crypto = require('crypto');
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        if (generated_signature === razorpay_signature) {
            // Log activity
            try {
                const activityService = require('../services/activityService');
                await activityService.logActivity(
                    userId,
                    serviceType,
                    'bill_payment',
                    `Bill payment of ₹${amount}`,
                    amount,
                    razorpay_payment_id
                );
            } catch (activityError) {
                console.error('Failed to log payment activity:', activityError);
            }

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
        console.error('Error in verifyPayment:', error);
        res.status(500).json({
            success: false,
            message: 'Payment verification failed'
        });
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

/**
 * Get all bills across all services for unified dashboard
 * GET /api/payment/all-bills/:userId
 */
exports.getAllBills = async (req, res) => {
    try {
        const { userId } = req.params;

        // Service-specific bill amounts
        const serviceBills = {
            electricity: { amount: 2450, consumption: '245 kWh', dueDate: '2026-02-25' },
            gas: { amount: 1850, consumption: '85 m³', dueDate: '2026-02-28' },
            water: { amount: 890, consumption: '12,500 L', dueDate: '2026-02-20' },
            waste: { amount: 350, consumption: 'Monthly Service', dueDate: '2026-03-01' }
        };

        const allBills = Object.keys(serviceBills).map(serviceType => ({
            billId: `BILL_${serviceType.toUpperCase()}_001`,
            serviceType,
            amount: serviceBills[serviceType].amount,
            consumption: serviceBills[serviceType].consumption,
            dueDate: serviceBills[serviceType].dueDate,
            status: 'pending',
            billingPeriod: 'Jan 2026'
        }));

        const totalAmount = allBills.reduce((sum, bill) => sum + bill.amount, 0);

        res.json({
            success: true,
            bills: allBills,
            totalAmount
        });
    } catch (error) {
        console.error('Error in getAllBills:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch all bills'
        });
    }
};

/**
 * Pay all bills at once (unified dashboard)
 * POST /api/payment/pay-all
 */
exports.payAllBills = async (req, res) => {
    try {
        const { userId, bills, totalAmount, paymentMethod } = req.body;

        if (!userId || !bills || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Create single Razorpay order for all bills
        const options = {
            amount: totalAmount * 100, // Amount in paise
            currency: 'INR',
            receipt: `rcpt_all_${Date.now()}`,
            notes: {
                userId,
                billCount: bills.length,
                billIds: bills.map(b => b.billId).join(',')
            }
        };

        const razorpay = require('razorpay');
        const razorpayInstance = new razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const order = await razorpayInstance.orders.create(options);

        res.json({
            success: true,
            order: {
                id: order.id,
                amount: order.amount,
                currency: order.currency
            },
            billCount: bills.length
        });
    } catch (error) {
        console.error('Error in payAllBills:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to initiate bulk payment'
        });
    }
};

