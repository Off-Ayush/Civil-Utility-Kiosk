exports.applyNewConnection = async (req, res) => {
    try {
        const { applicantName, mobile, email, address, serviceType, connectionType, userId } = req.body;
        const idProof = req.files?.idProof?.[0];
        const addressProof = req.files?.addressProof?.[0];

        // Validate required fields
        if (!applicantName || !mobile || !address || !serviceType || !connectionType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Generate application number
        const applicationNumber = `APP${Date.now().toString().slice(-8)}`;

        // In production, save to database
        const application = {
            applicationNumber,
            applicantName,
            mobile,
            email,
            address,
            serviceType,
            connectionType,
            idProofUrl: idProof ? `/uploads/documents/${idProof.filename}` : null,
            addressProofUrl: addressProof ? `/uploads/documents/${addressProof.filename}` : null,
            status: 'pending',
            createdAt: new Date()
        };

        // Log activity if userId is provided
        if (userId) {
            try {
                const activityService = require('../services/activityService');
                await activityService.logActivity(
                    userId,
                    serviceType,
                    'new_connection',
                    `New connection request for ${connectionType} service`,
                    null,
                    applicationNumber
                );
            } catch (activityError) {
                console.error('Failed to log activity:', activityError);
            }
        }

        res.json({
            success: true,
            message: 'Application submitted successfully',
            applicationNumber,
            application
        });
    } catch (error) {
        console.error('Error in applyNewConnection:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while submitting the application. Please try again.'
        });
    }
};

exports.getConnectionStatus = async (req, res) => {
    try {
        const { applicationNumber } = req.params;

        // Placeholder - fetch from database in production
        const application = {
            applicationNumber,
            status: 'pending',
            applicantName: 'John Doe',
            serviceType: 'electricity',
            connectionType: 'residential',
            createdAt: '2026-01-15',
            expectedCompletion: '2026-02-15',
            updates: [
                { date: '2026-01-15', status: 'pending', note: 'Application received' },
                { date: '2026-01-16', status: 'verification', note: 'Documents under verification' }
            ]
        };

        res.json({ success: true, application });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.submitMeterReading = async (req, res) => {
    try {
        const { userId, consumerId, reading, readingDate } = req.body;

        // In production, save to database

        res.json({
            success: true,
            message: 'Meter reading submitted successfully',
            reading: {
                consumerId,
                reading,
                readingDate,
                submittedAt: new Date()
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getServiceInfo = async (req, res) => {
    try {
        const { serviceType } = req.params;

        const serviceInfo = {
            electricity: {
                name: 'Electricity Department',
                helpline: '1800-XXX-1111',
                workingHours: '9 AM - 6 PM',
                services: ['Bill Payment', 'New Connection', 'Meter Reading', 'Complaints']
            },
            gas: {
                name: 'Gas Department',
                helpline: '1800-XXX-2222',
                workingHours: '9 AM - 6 PM',
                services: ['Bill Payment', 'New Connection', 'Safety Check', 'Complaints']
            },
            water: {
                name: 'Water Department',
                helpline: '1800-XXX-3333',
                workingHours: '9 AM - 6 PM',
                services: ['Bill Payment', 'New Connection', 'Quality Test', 'Complaints']
            },
            waste: {
                name: 'Waste Management Department',
                helpline: '1800-XXX-4444',
                workingHours: '6 AM - 6 PM',
                services: ['Schedule Pickup', 'Report Issue', 'Bulk Disposal', 'Complaints']
            }
        };

        res.json({ success: true, info: serviceInfo[serviceType] || {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
