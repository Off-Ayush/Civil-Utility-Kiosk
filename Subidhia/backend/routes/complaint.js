const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Ensure complaints upload directory exists
const complaintsDir = path.join(process.env.UPLOAD_PATH || './uploads', 'complaints');
if (!fs.existsSync(complaintsDir)) {
    fs.mkdirSync(complaintsDir, { recursive: true });
}

// Configure multer for complaint attachments
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, complaintsDir);
    },
    filename: (_req, file, cb) => {
        cb(null, `complaint_${uuidv4()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed'));
        }
    }
});

router.post('/register', auth, upload.single('attachment'), complaintController.registerComplaint);
router.get('/status/:trackingId', auth, complaintController.getComplaintStatus);
router.get('/user/:userId', auth, complaintController.getUserComplaints);
router.put('/update/:complaintId', auth, complaintController.updateComplaint);

module.exports = router;
