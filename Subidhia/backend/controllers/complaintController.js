exports.registerComplaint = async (req, res) => {
    try {
        const { userId, serviceType, complaintType, description } = req.body;
        const attachment = req.file;

        // Generate tracking ID
        const trackingId = `CMP${Date.now().toString().slice(-8)}`;

        // In production, save to database
        const complaint = {
            trackingId,
            userId,
            serviceType,
            complaintType,
            description,
            attachmentUrl: attachment ? `/uploads/complaints/${attachment.filename}` : null,
            status: 'registered',
            priority: 'medium',
            createdAt: new Date()
        };

        res.json({
            success: true,
            message: 'Complaint registered successfully',
            trackingId,
            complaint
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getComplaintStatus = async (req, res) => {
    try {
        const { trackingId } = req.params;

        // Placeholder - fetch from database in production
        const complaint = {
            trackingId,
            status: 'in_progress',
            complaintType: 'Power Outage',
            description: 'Power outage in sector 15',
            createdAt: '2026-01-18',
            expectedResolution: '2026-01-21',
            updates: [
                { date: '2026-01-18', status: 'registered', note: 'Complaint registered' },
                { date: '2026-01-19', status: 'in_progress', note: 'Team assigned' }
            ]
        };

        res.json({ success: true, complaint });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserComplaints = async (req, res) => {
    try {
        const { userId } = req.params;

        // Placeholder - fetch from database in production
        const complaints = [
            {
                trackingId: 'CMP12345678',
                complaintType: 'Power Outage',
                status: 'resolved',
                createdAt: '2026-01-10',
                resolvedAt: '2026-01-12'
            }
        ];

        res.json({ success: true, complaints });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateComplaint = async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { status, note, priority } = req.body;

        // In production, update in database

        res.json({
            success: true,
            message: 'Complaint updated successfully'
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
