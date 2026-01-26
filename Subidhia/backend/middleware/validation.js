const { body, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }
    next();
};

// Indian states list for validation
const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

// Registration validation
const registrationValidation = [
    // Aadhaar validation (12 digits, cannot start with 0 or 1)
    body('aadhaarNumber')
        .notEmpty().withMessage('Aadhaar number is required')
        .matches(/^[2-9]\d{11}$/).withMessage('Aadhaar must be 12 digits and cannot start with 0 or 1'),

    // Password validation (secure: min 8 chars, uppercase, lowercase, number, special char)
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character'),

    // Confirm password
    body('confirmPassword')
        .optional()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),

    // Name validation
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s.]+$/).withMessage('Name can only contain letters, spaces, and periods'),

    // Email validation (mandatory)
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),

    // Mobile validation (mandatory, Indian format)
    body('mobile')
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit Indian mobile number'),

    // Alternate mobile (optional)
    body('alternateMobile')
        .optional({ checkFalsy: true })
        .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit mobile number'),

    // Date of birth (optional)
    body('dateOfBirth')
        .optional({ checkFalsy: true })
        .isDate().withMessage('Please enter a valid date'),

    // Gender (optional)
    body('gender')
        .optional({ checkFalsy: true })
        .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),

    // Address Line 1 (mandatory)
    body('addressLine1')
        .notEmpty().withMessage('Address Line 1 is required')
        .isLength({ min: 5, max: 255 }).withMessage('Address must be between 5 and 255 characters'),

    // Address Line 2 (optional)
    body('addressLine2')
        .optional({ checkFalsy: true })
        .isLength({ max: 255 }).withMessage('Address Line 2 must not exceed 255 characters'),

    // Landmark (optional)
    body('landmark')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 }).withMessage('Landmark must not exceed 100 characters'),

    // City (mandatory)
    body('city')
        .notEmpty().withMessage('City is required')
        .isLength({ min: 2, max: 100 }).withMessage('City must be between 2 and 100 characters'),

    // District (mandatory)
    body('district')
        .notEmpty().withMessage('District is required')
        .isLength({ min: 2, max: 100 }).withMessage('District must be between 2 and 100 characters'),

    // State (mandatory, must be valid Indian state)
    body('state')
        .notEmpty().withMessage('State is required')
        .isIn(INDIAN_STATES).withMessage('Please select a valid Indian state'),

    // Pincode (mandatory, 6 digits)
    body('pincode')
        .notEmpty().withMessage('Pincode is required')
        .matches(/^\d{6}$/).withMessage('Pincode must be exactly 6 digits'),

    handleValidationErrors
];

// Aadhaar validation only
const aadhaarValidation = [
    body('aadhaarNumber')
        .notEmpty().withMessage('Aadhaar number is required')
        .matches(/^[2-9]\d{11}$/).withMessage('Aadhaar must be 12 digits and cannot start with 0 or 1'),
    handleValidationErrors
];

// Login validation
const loginValidation = [
    body('consumerId')
        .notEmpty().withMessage('Consumer ID / Aadhaar / Email / Mobile is required')
        .isLength({ min: 5 }).withMessage('Please enter a valid identifier'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleValidationErrors
];

// Payment validation
const paymentValidation = [
    body('amount')
        .notEmpty().withMessage('Amount is required')
        .isNumeric().withMessage('Amount must be a number')
        .custom((value) => value > 0).withMessage('Amount must be greater than 0'),
    body('billId')
        .notEmpty().withMessage('Bill ID is required'),
    handleValidationErrors
];

// Complaint validation
const complaintValidation = [
    body('serviceType')
        .notEmpty().withMessage('Service type is required')
        .isIn(['electricity', 'gas', 'water', 'waste']).withMessage('Invalid service type'),
    body('complaintType')
        .notEmpty().withMessage('Complaint type is required'),
    body('description')
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    handleValidationErrors
];

// New connection validation
const connectionValidation = [
    body('applicantName')
        .notEmpty().withMessage('Applicant name is required'),
    body('mobile')
        .notEmpty().withMessage('Mobile number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Invalid mobile number'),
    body('address')
        .notEmpty().withMessage('Address is required'),
    body('serviceType')
        .notEmpty().withMessage('Service type is required')
        .isIn(['electricity', 'gas', 'water']).withMessage('Invalid service type'),
    body('connectionType')
        .notEmpty().withMessage('Connection type is required')
        .isIn(['residential', 'commercial', 'industrial']).withMessage('Invalid connection type'),
    handleValidationErrors
];

module.exports = {
    registrationValidation,
    aadhaarValidation,
    loginValidation,
    paymentValidation,
    complaintValidation,
    connectionValidation,
    handleValidationErrors,
    INDIAN_STATES
};
