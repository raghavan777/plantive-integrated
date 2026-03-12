const express = require("express");
const {
    getAssignments,
    getFarmVerification,
    submitVerification
} = require("../controllers/verificationController.js");

const { authMiddleware: protect } = require("../middleware/authMiddleware.js");
const { roleMiddleware: authorize } = require("../middleware/roleMiddleware.js");

const router = express.Router();

// Official/district_officer only
router.get("/assignments", protect, authorize("district_officer"), getAssignments);
router.get("/farm/:id", protect, authorize("district_officer"), getFarmVerification);
router.put("/:id", protect, authorize("district_officer"), submitVerification);

// Backward-compat alias (POST → PUT)
router.post("/submit", protect, authorize("district_officer"), submitVerification);

module.exports = router;