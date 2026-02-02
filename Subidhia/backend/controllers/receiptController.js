/**
 * Receipt Controller
 * Handles sending payment receipts via email and SMS
 */

const emailService = require('../services/emailService');

/**
 * Send receipt to user's email
 * POST /api/receipt/send-email
 */
exports.sendReceiptEmail = async (req, res) => {
    try {
        const { email, transactionId, billAmount, serviceType, paymentDate, userName, consumerId } = req.body;

        if (!email || !transactionId) {
            return res.status(400).json({
                success: false,
                message: 'Email and transaction ID are required'
            });
        }

        // Generate receipt HTML for email
        const receiptData = {
            transactionId,
            billAmount,
            serviceType,
            paymentDate,
            userName,
            consumerId
        };

        // Send email
        await emailService.sendReceiptEmail(email, receiptData);

        res.json({
            success: true,
            message: 'Receipt sent successfully to ' + email
        });
    } catch (error) {
        console.error('Error sending receipt email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send receipt email'
        });
    }
};

/**
 * Send receipt link to user's mobile via SMS
 * POST /api/receipt/send-sms
 * 
 * Note: This is a placeholder implementation.
 * In production, integrate with SMS gateway like Twilio, MSG91, etc.
 */
exports.sendReceiptSMS = async (req, res) => {
    try {
        const { mobile, transactionId, billAmount, serviceType } = req.body;

        if (!mobile || !transactionId) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number and transaction ID are required'
            });
        }

        // Placeholder: In production, integrate with SMS gateway
        // Example message format:
        const message = `SUVIDHA Payment Receipt\nTxn: ${transactionId}\nAmount: Rs.${billAmount}\nService: ${serviceType}\nThank you for your payment!`;

        console.log(`[SMS Placeholder] Sending to ${mobile}:\n${message}`);

        // Simulate SMS sending delay
        await new Promise(resolve => setTimeout(resolve, 500));

        res.json({
            success: true,
            message: 'Receipt SMS sent successfully to ' + mobile
        });
    } catch (error) {
        console.error('Error sending receipt SMS:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send receipt SMS'
        });
    }
};

/**
 * Generate PDF receipt (server-side)
 * POST /api/receipt/generate-pdf
 * 
 * Note: Optional - PDF generation is handled client-side with html2pdf.js
 * This endpoint can be used for server-side PDF generation if needed
 */
exports.generatePDF = async (req, res) => {
    try {
        const { transactionId, billAmount, serviceType, paymentDate, userName, consumerId } = req.body;

        // For now, return a placeholder response
        // In production, use libraries like puppeteer or pdfkit to generate PDF
        res.json({
            success: true,
            message: 'PDF generation handled client-side',
            data: {
                transactionId,
                billAmount,
                serviceType,
                paymentDate,
                userName,
                consumerId
            }
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate PDF'
        });
    }
};
