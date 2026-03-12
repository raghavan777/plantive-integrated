const multer = require('multer');
const path = require('path');
const { logger } = require('../utils/logger');

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.env.UPLOAD_PATH || './uploads');
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and random string
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];

    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpg, jpeg, png, webp) are allowed!'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
        files: 5 // Max 5 files per upload
    }
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 5 files.'
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected field name for file upload.'
            });
        }
    }

    if (err) {
        logger.error('Upload error:', err);
        return res.status(400).json({
            success: false,
            message: err.message || 'File upload error'
        });
    }

    next();
};

// Middleware for single image upload
const uploadSingle = (fieldName) => {
    return [upload.single(fieldName), handleUploadError];
};

// Middleware for multiple image upload
const uploadMultiple = (fieldName, maxCount = 5) => {
    return [upload.array(fieldName, maxCount), handleUploadError];
};

// Middleware for mixed fields upload
const uploadFields = (fields) => {
    return [upload.fields(fields), handleUploadError];
};

module.exports = {
    upload,
    uploadSingle,
    uploadMultiple,
    uploadFields,
    handleUploadError
};