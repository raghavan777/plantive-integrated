const Submission = require('../models/Submission');
const Notification = require('../models/Notification');
const { emitNotification } = require('../services/websocketService');
const logger = require('../utils/logger');

// @desc    Get all submissions
// @route   GET /api/submissions
// @access  Private
exports.getSubmissions = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.farmer) filter.farmer = req.query.farmer;

        const submissions = await Submission.find(filter)
            .populate('farmer', 'name contact')
            .populate('plot', 'cropType healthStatus')
            .populate('verification.verifiedBy', 'name email');

        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single submission
// @route   GET /api/submissions/:id
// @access  Private
exports.getSubmission = async (req, res, next) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate('farmer')
            .populate('plot')
            .populate('verification.verifiedBy', 'name email');
        if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a submission
// @route   POST /api/submissions
// @access  Private
exports.createSubmission = async (req, res, next) => {
    try {
        const { farmer, plot, description } = req.body;
        const images = req.files ? req.files.map((f) => f.path) : req.body.images || [];

        const submission = await Submission.create({ farmer, plot, description, images, status: 'pending' });
        logger.info(`New submission created by farmer: ${farmer}`);

        // Notify admins
        const notification = await Notification.create({
            message: `New submission from farmer ${farmerId} for plot ${plotId}`,
            type: 'submission',
            userId: req.user?.id,
            readStatus: false,
        });
        emitNotification(notification);

        res.status(201).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify / update a submission
// @route   PUT /api/submissions/:id/verify
// @access  Admin / AgriOfficer
exports.verifySubmission = async (req, res, next) => {
    try {
        const { status, remarks } = req.body;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { status, verifiedBy: req.user.id, remarks },
            { new: true }
        ).populate('farmerId', 'name');

        if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

        // Notify the submitting farmer
        const notification = await Notification.create({
            message: `Your submission has been ${status}`,
            type: 'verification',
            userId: submission.farmer?._id,
            readStatus: false,
        });
        emitNotification(notification);

        logger.info(`Submission ${req.params.id} ${status} by ${req.user.id}`);
        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};