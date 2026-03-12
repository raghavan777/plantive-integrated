const Submission = require("../models/Submission");
const Farmer = require("../models/Farmer");
const Notification = require("../models/Notification");

// GET /api/verification - Get all pending submissions (for officials/dashboard)
const getAssignments = async (req, res, next) => {
    try {
        const submissions = await Submission.find({ status: "pending" })
            .populate("farmer", "name contact location")
            .populate("plot", "name cropType")
            .populate("submittedBy", "name email")
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
            .populate("images")
            .populate("submittedBy", "name email");

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

        const validResults = ["verified", "rejected", "needs_info", "under_review"];
        if (!validResults.includes(result)) {
            return res.status(400).json({
                success: false,
                message: `result must be one of: ${validResults.join(", ")}`
            });
        }

        const submission = await Submission.findByIdAndUpdate(
            req.params.id,
            {
                status: result,
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
            const farmerUser = await Farmer.findById(submission.farmer._id).select("registeredBy");
            if (farmerUser && farmerUser.registeredBy) {
                const isApproved = result === "verified";
                await Notification.create({
                    recipient: farmerUser.registeredBy,
                    type: isApproved ? "submission_verified" : "submission_rejected",
                    title: isApproved ? "Submission Approved ✅" : "Submission Needs Attention ❌",
                    message: isApproved
                        ? `Your submission (${submission.submissionId}) has been verified successfully.`
                        : `Your submission (${submission.submissionId}) was ${result}. ${rejectionReason || ""}`,
                    priority: isApproved ? "normal" : "high",
                    data: {
                        entityType: "submission",
                        entityId: submission._id,
                        actionRequired: result === "needs_info"
                    }
                });
            }
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