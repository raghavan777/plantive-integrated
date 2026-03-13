const express = require("express");
const {
    getAssignments,
    getFarmVerification,
    submitVerification
} = require("../controllers/verificationController");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// Required for mobile app officials
router.get("/assignments", protect, authorizeRoles("district_officer", "agriofficer"), getAssignments);
router.get("/farm/:id", protect, authorizeRoles("district_officer", "agriofficer"), getFarmVerification);
router.put("/:id", protect, authorizeRoles("district_officer", "agriofficer"), submitVerification);
router.post("/submit", protect, authorizeRoles("district_officer", "agriofficer"), submitVerification);

module.exports = router;
