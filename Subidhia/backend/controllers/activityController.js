const activityService = require('../services/activityService');

/**
 * Get activities by user and service
 * GET /api/activities/:userId/:serviceType
 */
exports.getActivitiesByService = async (req, res) => {
    try {
        const { userId, serviceType } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const result = await activityService.getActivitiesByUserAndService(
            parseInt(userId),
            serviceType === 'all' ? null : serviceType
        );

        res.json(result);
    } catch (error) {
        console.error('Error in getActivitiesByService:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            activities: []
        });
    }
};

/**
 * Get all activities for a user (unified dashboard)
 * GET /api/activities/:userId/all
 */
exports.getAllActivities = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const result = await activityService.getAllUserActivities(parseInt(userId));

        res.json(result);
    } catch (error) {
        console.error('Error in getAllActivities:', error);
        res.status(500).json({
            success: false,
            message: error.message,
            activities: []
        });
    }
};

/**
 * Log activity manually (for testing or admin purposes)
 * POST /api/activities/log
 */
exports.logActivity = async (req, res) => {
    try {
        const { userId, serviceType, activityType, description, amount, referenceId } = req.body;

        if (!userId || !serviceType || !activityType || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const result = await activityService.logActivity(
            userId, serviceType, activityType, description, amount, referenceId
        );

        res.json(result);
    } catch (error) {
        console.error('Error in logActivity:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
