const Submission = require("../models/Submission");
const Farmer = require("../models/Farmer");
const Notification = require("../models/Notification");
const { emitNotification } = require("../services/websocketService");

// GET /api/verification - Get all pending submissions (for officials/dashboard)
const getAssignments = async (req, res, next) => {
    try {
        const submissions = await Submission.find({ status: "pending" })
            .populate("farmer", "name contact location")
            .populate("plot", "name cropType")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: submissions.length, data: submissions });
    } catch (error) {
        next(error);
    }
};

// GET /api/verification/:id - Get a single submission for review
const getFarmVerification = async (req, res, next) => {
    try {
        const submission = await Submission.findById(req.params.id)
            .populate("farmer", "name contact location")
            .populate("plot", "name cropType area")
            .populate("images");

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        res.json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};

// PUT /api/verification/:id - Submit a verification decision (verified | rejected)
const submitVerification = async (req, res, next) => {
    try {
        const { result, notes, rejectionReason, confidenceScore } = req.body;

        const validResults = ["verified", "rejected", "needs_info", "under_review", "approved"];
        if (!validResults.includes(result)) {
            return res.status(400).json({
                success: false,
                message: `result must be one of: ${validResults.join(", ")}`
            });
        }

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                status: result === 'verified' ? 'approved' : result, // Normalize to Dashboard's 'approved'
                "verification.verifiedBy": req.user._id,
                "verification.verifiedAt": new Date(),
                "verification.notes": notes,
                "verification.rejectionReason": rejectionReason,
                "verification.confidenceScore": confidenceScore
            },
            { new: true }
        ).populate("farmer");

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission not found" });
        }

        // Auto-notify the farmer about the verification result
        if (submission.farmer) {
            const isApproved = result === "verified" || result === "approved";
            const notification = await Notification.create({
                recipient: submission.farmer._id,
                type: isApproved ? "submission_verified" : "submission_rejected",
                title: isApproved ? "Submission Approved ✅" : "Submission Needs Attention ❌",
                message: isApproved
                    ? `Your submission has been verified successfully.`
                    : `Your submission was ${result}. ${rejectionReason || ""}`,
                priority: isApproved ? "normal" : "high"
            });
            emitNotification(notification);
        }

        res.json({ success: true, data: submission });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAssignments,
    getFarmVerification,
    submitVerification
};
