const express = require("express");
const router = express.Router();

const {
    registerFarmer,
    farmerLogin,
    officialLogin,
    changePassword,
    sendOTP,
    verifyOTP
} = require("../controllers/authController");

const { authMiddleware: protect } = require("../middleware/authMiddleware");

router.post("/farmer/register", registerFarmer);
router.post("/farmer/login", farmerLogin);
router.post("/official/login", officialLogin);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/change-password", protect, changePassword);

module.exports = router;