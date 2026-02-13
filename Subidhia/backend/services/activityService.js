const { pool } = require('../config/database');

/**
 * Log user activity to database
 * @param {number} userId - User ID
 * @param {string} serviceType - Service type (electricity, gas, water, waste)
 * @param {string} activityType - Activity type (bill_payment, complaint, new_connection, profile_update)
 * @param {string} description - Activity description
 * @param {number} amount - Transaction amount (optional)
 * @param {string} referenceId - Reference ID (optional)
 */
const logActivity = async (userId, serviceType, activityType, description, amount = null, referenceId = null) => {
    try {
        const query = `
            INSERT INTO user_activities 
            (user_id, service_type, activity_type, description, amount, reference_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        await pool.query(query, [userId, serviceType, activityType, description, amount, referenceId]);
        return { success: true };
    } catch (error) {
        console.error('Error logging activity:', error);
        // Don't throw - activity logging should not break main functionality
        return { success: false, error: error.message };
    }
};

/**
 * Get activities by user and service type
 * @param {number} userId - User ID
 * @param {string} serviceType - Service type (optional, if not provided returns all)
 */
const getActivitiesByUserAndService = async (userId, serviceType = null) => {
    try {
        let query = `
            SELECT activity_id, service_type, activity_type, description, 
                   amount, reference_id, created_at
            FROM user_activities
            WHERE user_id = ?
        `;
        const params = [userId];

        if (serviceType) {
            query += ` AND service_type = ?`;
            params.push(serviceType);
        }

        query += ` ORDER BY created_at DESC LIMIT 50`;

        const [rows] = await pool.query(query, params);
        return { success: true, activities: rows };
    } catch (error) {
        console.error('Error fetching activities:', error);
        return { success: false, error: error.message, activities: [] };
    }
};

/**
 * Get all activities for a user (unified view)
 * @param {number} userId - User ID
 */
const getAllUserActivities = async (userId) => {
    return getActivitiesByUserAndService(userId, null);
};

module.exports = {
    logActivity,
    getActivitiesByUserAndService,
    getAllUserActivities
};
