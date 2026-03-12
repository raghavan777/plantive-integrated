const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: "7d"
    });
};

// In-memory store for pending registrations (phone -> {otp, expires})
const registrationOtps = new Map();

// Helper to find a role by name
const findRole = async (roleName) => {
    let role = await Role.findOne({ name: roleName });
    if (!role) {
        // Auto-seed the roles if they don't exist yet
        await Role.initializeRoles();
        role = await Role.findOne({ name: roleName });
    }
    return role;
};

exports.sendOTP = async (req, res, next) => {
    try {
        const { phone, isRegister } = req.body;
        if (!phone) {
            return res.status(400).json({ success: false, message: "Phone number is required" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Find user by phone
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
            // Store registration OTP in memory
            registrationOtps.set(phone, { otp, expires: otpExpires });
        }

        console.log(`\x1b[32m\n--- OTP SENT (${isRegister ? 'REGISTER' : 'LOGIN'}) ---\x1b[0m`);
        console.log(`\x1b[33mPhone:\x1b[0m ${phone}`);
        console.log(`\x1b[33mOTP CODE:\x1b[0m \x1b[1m\x1b[36m${otp}\x1b[0m`);
        console.log(`\x1b[32m----------------\n\x1b[0m`);

        res.json({ success: true, message: "OTP sent and logged to terminal" });
    } catch (error) {
        next(error);
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: "Phone and OTP are required" });
        }

        // Check registration OTPs first
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
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpires = null;
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Populate role for response
        const userWithRole = await User.findById(user._id).populate('role');

        res.json({
            success: true,
            _id: user._id,
            name: user.name,
            role: userWithRole.role.name,
            token: generateToken(user._id),
            isNewUser: false
        });
    } catch (error) {
        next(error);
    }
};

exports.registerFarmer = async (req, res, next) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Look up the farmer role (or create it if needed)
        const farmerRole = await findRole("farmer");
        if (!farmerRole) {
            return res.status(500).json({ message: "Farmer role not found. Please seed the roles." });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            role: farmerRole._id
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            role: "farmer",
            token: generateToken(user._id)
        });

    } catch (error) {
        next(error);
    }
};

exports.farmerLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find farmer role
        const farmerRole = await findRole("farmer");
        if (!farmerRole) {
            return res.status(500).json({ message: "Farmer role not configured." });
        }

        const user = await User.findOne({ email, role: farmerRole._id }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Update lastLogin
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        res.json({
            _id: user._id,
            name: user.name,
            role: "farmer",
            token: generateToken(user._id)
        });

    } catch (error) {
        next(error);
    }
};

exports.officialLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find district_officer role (officials in Dashboard are district_officers)
        const officialRole = await findRole("district_officer");
        if (!officialRole) {
            return res.status(500).json({ message: "Official role not configured." });
        }

        const user = await User.findOne({ email, role: officialRole._id }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Update lastLogin
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        res.json({
            _id: user._id,
            name: user.name,
            role: "district_officer",
            token: generateToken(user._id)
        });

    } catch (error) {
        next(error);
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { oldPassword, newPassword } = req.body;

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });

    } catch (error) {
        next(error);
    }
};