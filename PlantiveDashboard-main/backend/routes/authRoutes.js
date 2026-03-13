const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getMe, 
    sendOTP, 
    verifyOTP, 
    registerFarmer 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Standard API Routes
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

// Mobile App Compatibility Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/farmer/register', registerFarmer);
router.post('/farmer/login', login); // Shared login logic
router.post('/official/login', login); // Shared login logic

module.exports = router;