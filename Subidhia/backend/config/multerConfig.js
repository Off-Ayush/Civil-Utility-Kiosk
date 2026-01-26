const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

// Ensure upload directories exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
const profilesDir = path.join(uploadDir, 'profiles');
const documentsDir = path.join(uploadDir, 'documents');

[uploadDir, profilesDir, documentsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// File filter for images
const imageFilter = (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(',');

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'), false);
    }
};

// Storage configuration for profile photos
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, profilesDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `profile_${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Storage configuration for documents (Aadhaar images, etc.)
const documentStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, documentsDir);
    },
    filename: (req, file, cb) => {
        const docType = req.body.documentType || 'doc';
        const uniqueName = `${docType}_${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

// Multer instances
const uploadProfile = multer({
    storage: profileStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit for profile photos
    }
});

const uploadDocument = multer({
    storage: documentStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for documents
    }
});

// Error handler for multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB for documents and 2MB for profile photos.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    } else if (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

module.exports = {
    uploadProfile,
    uploadDocument,
    handleMulterError,
    uploadDir,
    profilesDir,
    documentsDir
};
