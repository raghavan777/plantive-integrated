const Image = require("../models/Image");
const path = require("path");

// POST /api/images/upload - Upload an image linked to a submission or plot
const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const { entityType, entityId } = req.body;

        if (!entityType || !entityId) {
            return res.status(400).json({
                success: false,
                message: "entityType (submission|plot|farmer) and entityId are required"
            });
        }

        // Build URL from file path (served via /uploads static route)
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

        const image = await Image.create({
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            url: fileUrl,
            mimeType: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user._id,
            entityType,
            entityId,
            analysisStatus: "pending"
        });

        res.status(201).json({ success: true, data: image });
    } catch (error) {
        next(error);
    }
};

// GET /api/images/:entityType/:entityId - Get images for a given entity
const getEntityImages = async (req, res, next) => {
    try {
        const { entityType, entityId } = req.params;

        const images = await Image.find({ entityType, entityId })
            .sort({ createdAt: -1 });

        res.json({ success: true, count: images.length, data: images });
    } catch (error) {
        next(error);
    }
};

// Kept for backward compatibility - get images for a submission
const getSubmissionImages = async (req, res, next) => {
    try {
        const images = await Image.find({
            entityType: "submission",
            entityId: req.params.submissionId
        }).sort({ createdAt: -1 });

        res.json({ success: true, count: images.length, data: images });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadImage,
    getEntityImages,
    getSubmissionImages
};