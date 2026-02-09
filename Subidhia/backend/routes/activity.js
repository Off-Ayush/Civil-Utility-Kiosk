const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// Get activities by service type
router.get('/:userId/:serviceType', activityController.getActivitiesByService);

// Get all activities (unified)
router.get('/:userId/all', activityController.getAllActivities);

// Log activity manually (for testing/admin)
router.post('/log', auth, activityController.logActivity);

module.exports = router;
