const AIResult = require('../models/AIResult');
const Image = require('../models/Image');
const Plot = require('../models/Plot');
const Notification = require('../models/Notification');
const { analyzeImage } = require('../services/aiService');
const { emitDamageAlert } = require('../services/websocketService');
const logger = require('../utils/logger');

// @desc    Analyze a crop image using AI
// @route   POST /api/ai/analyze
// @access  Private
exports.analyzeImage = async (req, res, next) => {
    try {
        const { imageId } = req.body;

        if (!imageId) {
            return res.status(400).json({ success: false, message: 'imageId is required' });
        }

        const image = await Image.findById(imageId);
        if (!image) return res.status(404).json({ success: false, message: 'Image not found' });

        // Call AI service (mock or real)
        const analysisData = await analyzeImage(image.imageUrl);

        // Save result
        const aiResult = await AIResult.create({
            imageId: image._id,
            diseaseDetected: analysisData.diseaseDetected,
            confidence: analysisData.confidence,
            recommendation: analysisData.recommendation,
            rawResult: analysisData.raw || {},
        });

        // Update image with analysis result
        image.analysisResult = aiResult._id;
        await image.save();

        // If high-confidence disease detected, update plot health and emit alert
        if (analysisData.diseaseDetected && analysisData.confidence >= 0.7 && image.plotId) {
            await Plot.findByIdAndUpdate(image.plotId, { healthStatus: 'critical' });

            const notification = await Notification.create({
                message: `⚠️ Disease detected on plot ${image.plotId}: ${analysisData.diseaseDetected} (${Math.round(analysisData.confidence * 100)}% confidence)`,
                type: 'damage_alert',
                userId: req.user?.id,
                readStatus: false,
            });

            emitDamageAlert({ plotId: image.plotId, aiResult, notification });
            logger.warn(`Damage alert emitted for plot: ${image.plotId}`);
        }

        res.status(200).json({
            success: true,
            data: aiResult,
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all AI results
// @route   GET /api/ai/results
// @access  Private
exports.getAIResults = async (req, res, next) => {
    try {
        const results = await AIResult.find()
            .populate({ path: 'imageId', populate: { path: 'plotId', select: 'cropType healthStatus' } });
        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (err) {
        next(err);
    }
};

// @desc    Get AI result by ID
// @route   GET /api/ai/results/:id
// @access  Private
exports.getAIResult = async (req, res, next) => {
    try {
        const result = await AIResult.findById(req.params.id).populate('imageId');
        if (!result) return res.status(404).json({ success: false, message: 'AI result not found' });
        res.status(200).json({ success: true, data: result });
    } catch (err) {
        next(err);
    }
};