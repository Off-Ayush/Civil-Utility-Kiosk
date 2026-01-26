/**
 * Aadhaar Verification Service
 * 
 * Features:
 * - 12-digit format validation
 * - Verhoeff checksum algorithm (same as UIDAI)
 * - Sandbox mode for development
 * - Ready for UIDAI API integration
 */

// Verhoeff algorithm tables
const d = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const p = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validate Aadhaar number using Verhoeff checksum
 * @param {string} aadhaar - 12-digit Aadhaar number
 * @returns {boolean} - True if valid checksum
 */
const validateVerhoeffChecksum = (aadhaar) => {
    let c = 0;
    const reversedDigits = aadhaar.split('').reverse().map(Number);

    for (let i = 0; i < reversedDigits.length; i++) {
        c = d[c][p[i % 8][reversedDigits[i]]];
    }

    return c === 0;
};

/**
 * Validate 12-digit format
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {object} - Validation result with isValid and message
 */
const validateFormat = (aadhaar) => {
    // Remove any spaces or dashes
    const cleanedAadhaar = aadhaar.replace(/[\s-]/g, '');

    // Check if it's exactly 12 digits
    if (!/^\d{12}$/.test(cleanedAadhaar)) {
        return {
            isValid: false,
            message: 'Aadhaar must be exactly 12 digits'
        };
    }

    // First digit cannot be 0 or 1
    if (['0', '1'].includes(cleanedAadhaar[0])) {
        return {
            isValid: false,
            message: 'Aadhaar number cannot start with 0 or 1'
        };
    }

    // Check for repeated digits (obviously invalid)
    if (/^(\d)\1{11}$/.test(cleanedAadhaar)) {
        return {
            isValid: false,
            message: 'Invalid Aadhaar number format'
        };
    }

    // Validate Verhoeff checksum
    if (!validateVerhoeffChecksum(cleanedAadhaar)) {
        return {
            isValid: false,
            message: 'Invalid Aadhaar number (checksum failed)'
        };
    }

    return {
        isValid: true,
        cleanedAadhaar,
        message: 'Valid Aadhaar format'
    };
};

/**
 * Simulate Aadhaar verification (for development/sandbox mode)
 * In production, this would call UIDAI's eKYC API
 * @param {string} aadhaar - 12-digit Aadhaar number
 * @returns {object} - Mock verification response
 */
const simulateVerification = async (aadhaar) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In sandbox mode, return mock data for valid format Aadhaar
    const formatValidation = validateFormat(aadhaar);

    if (!formatValidation.isValid) {
        return {
            success: false,
            verified: false,
            message: formatValidation.message
        };
    }

    // Mock successful verification
    return {
        success: true,
        verified: true,
        message: 'Aadhaar verification successful (sandbox mode)',
        data: {
            aadhaarNumber: formatValidation.cleanedAadhaar.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3'),
            name: null, // In production, this would come from UIDAI
            verificationTimestamp: new Date().toISOString(),
            mode: 'sandbox'
        }
    };
};

/**
 * Real Aadhaar API verification (placeholder for UIDAI integration)
 * @param {string} aadhaar - 12-digit Aadhaar number
 * @param {string} otp - OTP received by user
 * @returns {object} - Verification response from UIDAI
 */
const verifyWithUIDAI = async (aadhaar, otp) => {
    // TODO: Implement actual UIDAI API integration
    // This requires:
    // 1. Agency registration with UIDAI
    // 2. License key and agency code
    // 3. Secure API endpoint calls

    throw new Error('UIDAI API integration not configured. Please set up credentials in .env');
};

/**
 * Main verification function
 * Routes to sandbox or production API based on config
 * @param {string} aadhaar - 12-digit Aadhaar number
 * @param {string} otp - Optional OTP for full verification
 * @returns {object} - Verification result
 */
const verifyAadhaar = async (aadhaar, otp = null) => {
    const mode = process.env.AADHAAR_API_MODE || 'sandbox';

    // Clean the Aadhaar number
    const cleanedAadhaar = aadhaar.replace(/[\s-]/g, '');

    // First validate format
    const formatValidation = validateFormat(cleanedAadhaar);
    if (!formatValidation.isValid) {
        return {
            success: false,
            verified: false,
            error: formatValidation.message
        };
    }

    if (mode === 'sandbox') {
        return await simulateVerification(cleanedAadhaar);
    } else if (mode === 'production' && otp) {
        return await verifyWithUIDAI(cleanedAadhaar, otp);
    } else {
        // Format-only validation for production without OTP
        return {
            success: true,
            verified: false,
            message: 'Aadhaar format valid. OTP verification required for full verification.',
            data: {
                aadhaarNumber: cleanedAadhaar.replace(/(\d{4})(\d{4})(\d{4})/, 'XXXX-XXXX-$3'),
                formatValid: true,
                checksumValid: true
            }
        };
    }
};

/**
 * Check if Aadhaar is already registered
 * @param {object} pool - Database connection pool
 * @param {string} aadhaar - 12-digit Aadhaar number
 * @returns {boolean} - True if Aadhaar exists in database
 */
const isAadhaarRegistered = async (pool, aadhaar) => {
    const cleanedAadhaar = aadhaar.replace(/[\s-]/g, '');
    const [rows] = await pool.execute(
        'SELECT user_id FROM users WHERE aadhaar_number = ?',
        [cleanedAadhaar]
    );
    return rows.length > 0;
};

module.exports = {
    validateFormat,
    validateVerhoeffChecksum,
    verifyAadhaar,
    simulateVerification,
    isAadhaarRegistered
};
