const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure documents upload directory exists
const documentsDir = path.join(process.env.UPLOAD_PATH || './uploads', 'documents');
if (!fs.existsSync(documentsDir)) {
    fs.mkdirSync(documentsDir, { recursive: true });
}

// Configure multer for document uploads
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, documentsDir);
    },
    filename: (_req, file, cb) => {
        cb(null, `service_${uuidv4()}${path.extname(file.originalname)}`);
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
