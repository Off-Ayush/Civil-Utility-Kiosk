/**
 * Email Service
 * Handles sending emails using Nodemailer
 * 
 * Configuration via environment variables:
 * - SMTP_HOST: SMTP server hostname
 * - SMTP_PORT: SMTP server port
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - EMAIL_FROM: Sender email address
 */

const nodemailer = require('nodemailer');

// Create transporter (configure in production with real SMTP credentials)
const createTransporter = () => {
    // Check if SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_PORT === '465',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    // Fallback: Use ethereal for development/testing
    console.log('[Email Service] SMTP not configured. Using console log for emails.');
    return null;
};

/**
 * Generate HTML template for receipt email
 */
const generateReceiptEmailHTML = (receiptData) => {
    const { transactionId, billAmount, serviceType, paymentDate, userName, consumerId } = receiptData;

    const serviceColors = {
        electricity: '#f59e0b',
        gas: '#ef4444',
        water: '#3b82f6',
        waste: '#22c55e'
    };

    const color = serviceColors[serviceType] || '#8b5cf6';

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SUVIDHA Payment Receipt</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, ${color}, ${color}dd); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">SUVIDHA</h1>
                <p style="margin: 10px 0 0; opacity: 0.9;">Payment Receipt</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px;">
                <!-- Success Badge -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; background: #dcfce7; color: #16a34a; padding: 10px 20px; border-radius: 50px; font-weight: 600;">
                        ✓ Payment Successful
                    </div>
                </div>
                
                <!-- Amount -->
                <div style="text-align: center; padding: 20px; background: #f9fafb; border-radius: 12px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Amount Paid</p>
                    <p style="margin: 10px 0 0; font-size: 36px; font-weight: bold; color: #1f2937;">₹${billAmount?.toLocaleString('en-IN') || '0'}</p>
                </div>
                
                <!-- Details Table -->
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Transaction ID</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; font-family: monospace;">${transactionId}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Payment Date</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${paymentDate}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Service Type</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600; text-transform: capitalize;">${serviceType}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Customer Name</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${userName || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; color: #6b7280;">Consumer ID</td>
                        <td style="padding: 12px 0; text-align: right; font-weight: 600;">${consumerId || 'N/A'}</td>
                    </tr>
                </table>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">Thank you for using SUVIDHA Kiosk</p>
                <p style="margin: 10px 0 0; color: #9ca3af; font-size: 12px;">This is a computer-generated receipt and does not require signature</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Send receipt email
 * @param {string} email - Recipient email address
 * @param {object} receiptData - Receipt details
 */
exports.sendReceiptEmail = async (email, receiptData) => {
    const transporter = createTransporter();

    const htmlContent = generateReceiptEmailHTML(receiptData);

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"SUVIDHA Kiosk" <noreply@suvidha.gov.in>',
        to: email,
        subject: `Payment Receipt - ${receiptData.transactionId}`,
        html: htmlContent
    };

    if (transporter) {
        const info = await transporter.sendMail(mailOptions);
        console.log('[Email Service] Email sent:', info.messageId);
        return info;
    } else {
        // Log email for development
        console.log('[Email Service] Would send email to:', email);
        console.log('[Email Service] Subject:', mailOptions.subject);
        console.log('[Email Service] Receipt Data:', JSON.stringify(receiptData, null, 2));
        return { messageId: 'dev-mode-' + Date.now() };
    }
};

/**
 * Send generic email
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - HTML content
 */
exports.sendEmail = async (to, subject, html) => {
    const transporter = createTransporter();

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"SUVIDHA Kiosk" <noreply@suvidha.gov.in>',
        to,
        subject,
        html
    };

    if (transporter) {
        return await transporter.sendMail(mailOptions);
    } else {
        console.log('[Email Service] Would send email to:', to);
        console.log('[Email Service] Subject:', subject);
        return { messageId: 'dev-mode-' + Date.now() };
    }
};
