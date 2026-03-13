const Submission = require('../models/Submission');
const Farmer = require('../models/Farmer');
const Notification = require('../models/Notification');
const { emitNotification } = require('../services/websocketService');
const logger = require('../utils/logger');

// @desc    Get all submissions (Admin/Official)
// @route   GET /api/submissions
// @access  Private
exports.getSubmissions = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.status) filter.status = req.query.status;
        if (req.query.farmer) filter.farmer = req.query.farmer;

        const submissions = await Submission.find(filter)
            .populate('farmer', 'name contact')
            .populate('plot', 'name cropType healthStatus')
            .populate('verification.verifiedBy', 'name email');

        res.status(200).json({ success: true, count: submissions.length, data: submissions });
    } catch (err) {
        next(err);
    }
};

// @desc    Get submission history for the logged-in farmer
// @route   GET /api/submissions/history
// @access  Farmer
exports.getSubmissionHistory = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOne({ registeredBy: req.user._id });
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        const submissions = await Submission.find({ farmer: farmer._id })
            .populate("plot", "name cropType")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: submissions.length, data: submissions });
    } catch (error) {
        next(error);
    }
};

// @desc    Get only status trackers for the logged-in farmer
// @route   GET /api/submissions/status
// @access  Farmer
exports.getSubmissionStatus = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOne({ registeredBy: req.user._id });
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        const submissions = await Submission.find({ farmer: farmer._id })
            .populate("plot", "name cropType")
            .select("submissionId status createdAt verification.verifiedAt verification.rejectionReason priority data plot")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: submissions });
    } catch (error) {
        next(error);
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

// @desc    Create a submission (Farmer)
// @route   POST /api/submissions
// @access  Private
exports.createSubmission = async (req, res, next) => {
    try {
        let farmerId = req.body.farmer || req.body.farmerId;
        const plotId = req.body.plot || req.body.plotId;

        // Auto-resolve farmer if not provided (for logged in farmer)
        if (!farmerId && req.user.role?.name === 'farmer') {
            const farmer = await Farmer.findOne({ registeredBy: req.user._id });
            if (farmer) farmerId = farmer._id;
        }

        if (!farmerId || !plotId) {
            return res.status(400).json({ success: false, message: "Farmer and Plot IDs are required" });
        }

        const images = req.files ? req.files.map((f) => f.path) : req.body.images || [];

        const submission = await Submission.create({ 
            ...req.body,
            farmer: farmerId, 
            plot: plotId, 
            submittedBy: req.user._id,
            images, 
            status: 'pending' 
        });
        
        logger.info(`New submission created by farmer: ${farmerId}`);

        // Notify admins/officials
        const authId = req.user?.id || req.user?._id;
        const notification = await Notification.create({
            recipient: null, // Broadcast to staff
            type: 'system',
            title: 'New Crop Submission',
            message: `Farmer ${farmerId} submitted a new report for plot ${plotId}`,
            data: { 
                entityType: 'Submission',
                entityId: submission._id
            }
        });
        emitNotification(notification);

        res.status(201).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify / update a submission (Admin/Official)
// @route   PUT /api/submissions/:id/verify
// @access  Admin / AgriOfficer
exports.verifySubmission = async (req, res, next) => {
    try {
        const { status, remarks, notes } = req.body;

        if (!['verified', 'rejected', 'pending', 'needs_info', 'under_review'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            { 
                status, 
                "verification.verifiedBy": req.user._id, 
                "verification.verifiedAt": new Date(),
                "verification.notes": notes || remarks 
            },
            { new: true }
        ).populate('farmer');

        if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });

        // Notify the submitting farmer
        const notification = await Notification.create({
            recipient: submission.farmer?._id,
            type: status === 'verified' ? 'submission_verified' : 'submission_rejected',
            title: `Submission ${status.toUpperCase()}`,
            message: `Your submission has been ${status}. ${remarks || ""}`,
            priority: status === 'rejected' ? 'high' : 'normal'
        });
        emitNotification(notification);

        logger.info(`Submission ${req.params.id} ${status} by ${req.user._id}`);
        res.status(200).json({ success: true, data: submission });
    } catch (err) {
        next(err);
    }
};