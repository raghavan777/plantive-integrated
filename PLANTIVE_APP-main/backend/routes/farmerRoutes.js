const express = require("express");
const {
    getFarmerProfile,
    createFarmerProfile,
    updateFarmerProfile,
    getFarmerHistory
} = require("../controllers/farmerController.js");

const { authMiddleware: protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/profile", protect, getFarmerProfile);
router.post("/", protect, createFarmerProfile);
router.put("/profile", protect, updateFarmerProfile);
router.get("/history", protect, getFarmerHistory);

module.exports = router;