const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const multer = require('multer');

// Configure multer for document uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/documents/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

router.post('/new-connection', upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 }
]), serviceController.applyNewConnection);
router.get('/connection-status/:applicationNumber', serviceController.getConnectionStatus);
router.post('/meter-reading', auth, serviceController.submitMeterReading);
router.get('/service-info/:serviceType', serviceController.getServiceInfo);

module.exports = router;
