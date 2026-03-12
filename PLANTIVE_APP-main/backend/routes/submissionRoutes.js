const express = require("express");
const {
    createSubmission,
    getSubmissionHistory,
    getSubmissionStatus,
    getSubmission
} = require("../controllers/submissionController.js");

const { authMiddleware: protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", protect, createSubmission);
router.get("/history", protect, getSubmissionHistory);
router.get("/status", protect, getSubmissionStatus);
router.get("/:id", protect, getSubmission);

module.exports = router;