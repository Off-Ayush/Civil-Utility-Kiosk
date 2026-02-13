const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const auth = require('../middleware/auth');

// Get all activities (unified) — must be before :serviceType to avoid "all" matching as serviceType
router.get('/:userId/all', activityController.getAllActivities);

// Get activities by service type
router.get('/:userId/:serviceType', activityController.getActivitiesByService);

// Log activity manually (for testing/admin)
router.post('/log', auth, activityController.logActivity);

module.exports = router;
