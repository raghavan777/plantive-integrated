const Image = require('../models/Image');
const path = require('path');
const logger = require('../utils/logger');

// @desc    Upload image(s)
// @route   POST /api/images/upload
// @access  Private
exports.uploadImage = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: 'No files uploaded' });
        }

        const { plotId } = req.body;
        const savedImages = [];

        for (const file of req.files) {
            const image = await Image.create({
                plotId: plotId || null,
                imageUrl: `/uploads/${file.filename}`,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size,
            });
            savedImages.push(image);
        }

        logger.info(`${savedImages.length} image(s) uploaded`);
        res.status(201).json({ success: true, count: savedImages.length, data: savedImages });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all images
// @route   GET /api/images
// @access  Private
exports.getImages = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.plotId) filter.plotId = req.query.plotId;

        const images = await Image.find(filter).populate('plotId', 'cropType healthStatus');
        res.status(200).json({ success: true, count: images.length, data: images });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single image
// @route   GET /api/images/:id
// @access  Private
exports.getImage = async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id).populate('plotId');
        if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
        res.status(200).json({ success: true, data: image });
    } catch (err) {
        next(err);
    }
};

// @desc    Compare two images (returns both for frontend diff rendering)
// @route   GET /api/images/compare?imageA=id&imageB=id
// @access  Private
exports.compareImages = async (req, res, next) => {
    try {
        const { imageA, imageB } = req.query;
        if (!imageA || !imageB) {
            return res.status(400).json({ success: false, message: 'Provide imageA and imageB query params' });
        }

        const [imgA, imgB] = await Promise.all([
            Image.findById(imageA),
            Image.findById(imageB),
        ]);

        if (!imgA || !imgB) return res.status(404).json({ success: false, message: 'One or both images not found' });

        res.status(200).json({
            success: true,
            data: {
                imageA: imgA,
                imageB: imgB,
                comparison: {
                    samePlot: String(imgA.plotId) === String(imgB.plotId),
                    timeDifference: Math.abs(new Date(imgA.timestamp) - new Date(imgB.timestamp)),
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete an image
// @route   DELETE /api/images/:id
// @access  Admin
exports.deleteImage = async (req, res, next) => {
    try {
        const image = await Image.findByIdAndDelete(req.params.id);
        if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
        res.status(200).json({ success: true, message: 'Image deleted' });
    } catch (err) {
        next(err);
    }
};