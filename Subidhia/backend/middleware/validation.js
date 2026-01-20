const { body, param, validationResult } = require('express-validator');

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

// Login validation
const loginValidation = [
    body('consumerId')
        .notEmpty().withMessage('Consumer ID is required')
        .isLength({ min: 5 }).withMessage('Consumer ID must be at least 5 characters'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters'),
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
    loginValidation,
    paymentValidation,
    complaintValidation,
    connectionValidation,
    handleValidationErrors
};
