const Submission = require("../models/Submission");
const Farmer = require("../models/Farmer");
const Notification = require("../models/Notification");

// POST /api/submissions - Create a new crop submission
const createSubmission = async (req, res, next) => {
    try {
        // Find the farmer profile of the logged-in user
        const farmer = await Farmer.findOne({ registeredBy: req.user._id });
        if (!farmer) {
            return res.status(400).json({
                success: false,
                message: "Farmer profile not found. Please create your profile first at POST /api/farmers"
            });
        }

        const {
            plotId,
            submissionType,
            description,
            location,           // { coordinates: [lng, lat], accuracy }
            data,               // { pestObserved, diseaseObserved, notes, ... }
            priority,
            images
        } = req.body;

        const submission = await Submission.create({
            farmer: farmer._id,
            plot: plotId,
            submittedBy: req.user._id,
            submissionType: submissionType || "routine_inspection",
            description,
            location: location || {},
            data: data || {},
            priority: priority || "normal",
            images: images || [],
            status: "pending"
        });

        res.status(201).json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};

// GET /api/submissions - Get submission history for the logged-in farmer
const getSubmissionHistory = async (req, res, next) => {
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

// GET /api/submissions/status - Get only status + timestamps for the farmer
const getSubmissionStatus = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOne({ registeredBy: req.user._id });
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        const submissions = await Submission.find({ farmer: farmer._id })
            .select("submissionId status createdAt verification.verifiedAt verification.rejectionReason priority")
            .sort({ createdAt: -1 });

        res.json({ success: true, data: submissions });
    } catch (error) {
        next(error);
    }
};

// GET /api/submissions/:id - Get a single submission
const getSubmission = async (req, res, next) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate("farmer", "name contact")
            .populate("plot", "name cropType")
            .populate("images");

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        res.json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSubmission,
    getSubmissionHistory,
    getSubmissionStatus,
    getSubmission
};