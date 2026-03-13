const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validateEmail } = require('../utils/validators');
const logger = require('../utils/logger');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};

// In-memory store for pending registrations (phone -> {otp, expires})
const registrationOtps = new Map();

// Helper to find a role by name
const findRole = async (roleName) => {
    const Role = require('../models/Role');
    let role = await Role.findOne({ name: roleName });
    if (!role) {
        await Role.initializeRoles();
        role = await Role.findOne({ name: roleName });
    }
    return role;
};

// @desc    Send OTP to phone
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res, next) => {
    try {
        const { phone, isRegister } = req.body;
        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        let user = await User.findOne({ phone });
        
        if (!user && !isRegister) {
            return res.status(404).json({ 
                success: false, 
                message: "No user found with this phone number. Please register first." 
            });
        }

        if (user && isRegister) {
            return res.status(400).json({ 
                success: false, 
                message: "A user with this phone number is already registered. Please log in." 
            });
        }

        if (user) {
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save({ validateBeforeSave: false });
        } else {
            registrationOtps.set(phone, { otp, expires: otpExpires });
        }

        console.log(`\n--- OTP SENT (${isRegister ? 'REGISTER' : 'LOGIN'}) ---`);
        console.log(`Phone: ${phone}`);
        console.log(`OTP CODE: ${otp}`);
        console.log(`----------------\n`);

        res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: "Phone and OTP are required" });
        }

        const pending = registrationOtps.get(phone);
        if (pending && pending.otp === otp && pending.expires > Date.now()) {
            registrationOtps.delete(phone);
            return res.json({
                success: true,
                message: "OTP verified",
                isNewUser: true
            });
        }

        const user = await User.findOne({ 
            phone, 
            otp, 
            otpExpires: { $gt: Date.now() } 
        }).populate('role');

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        user.otp = null;
        user.otpExpires = null;
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        res.json({
            success: true,
            message: "OTP verified",
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                role: user.role?.name || 'farmer',
                phone: user.phone
            },
            isNewUser: false
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register a farmer
// @route   POST /api/auth/farmer/register (Mobile) or /api/auth/register-farmer
// @access  Public
exports.registerFarmer = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { phone }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User with this email or phone already exists" });
        }

        const farmerRole = await findRole("farmer");
        if (!farmerRole) {
            return res.status(500).json({ success: false, message: "Farmer role not found." });
        }

        const user = await User.create({
            name,
            email: email || `${phone}@plantive.com`, // Fallback for mobile
            password,
            phone,
            role: farmerRole._id
        });

        res.status(201).json({
            success: true,
            token: generateToken(user),
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: "farmer"
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Register a new user (Standard)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        // Resolve role to ObjectId
        const roleObj = await findRole(role || 'viewer');
        if (!roleObj) {
            return res.status(400).json({ success: false, message: `Role ${role} not found` });
        }

        const user = await User.create({ name, email, password, role: roleObj._id });
        const token = generateToken(user);

        logger.info(`New user registered: ${email}`);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: { id: user._id, name: user.name, email: user.email, role: roleObj.name },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Login user (Standard)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, phone, password } = req.body;

        if ((!email && !phone) || !password) {
            return res.status(400).json({ success: false, message: 'Please provide credentials' });
        }

        const query = email ? { email } : { phone };
        const user = await User.findOne(query).select('+password').populate('role');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        logger.info(`User logged in: ${user.email}`);

        // Try to find official profile for additional meta
        const Official = require('../models/Official');
        const officialProfile = await Official.findOne({ userId: user._id });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                role: user.role?.name || 'user',
                district: officialProfile?.assignedDistricts?.[0] || 'Unknown District',
                designation: officialProfile?.designation || 'Staff'
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).populate('role');
        res.status(200).json({ success: true, user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role?.name,
            phone: user.phone
        }});
    } catch (err) {
        next(err);
    }
};