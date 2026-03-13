const Farmer = require('../models/Farmer');
const Submission = require('../models/Submission');
const logger = require('../utils/logger');

// @desc    Get all farmers (Admin/Official)
// @route   GET /api/farmers
// @access  Private
exports.getFarmers = async (req, res, next) => {
    try {
        const farmers = await Farmer.find().populate('plots');
        res.status(200).json({ success: true, count: farmers.length, data: farmers });
    } catch (err) {
        next(err);
    }
};

// @desc    Get the logged-in farmer's profile
// @route   GET /api/farmers/profile
// @access  Farmer
exports.getFarmerProfile = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOne({ registeredBy: req.user._id })
            .select("+pmfbyId +uidNumber")
            .populate("plots", "name cropType status healthStatus area")
            .lean();

        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        res.json({ success: true, data: farmer });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single farmer (Admin/Official)
// @route   GET /api/farmers/:id
// @access  Private
exports.getFarmer = async (req, res, next) => {
    try {
        const farmer = await Farmer.findById(req.params.id).populate('plots');
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
        res.status(200).json({ success: true, data: farmer });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a farmer profile (Official or Self-register)
// @route   POST /api/farmers
// @access  Private
exports.createFarmer = async (req, res, next) => {
    try {
        // Support both registration styles
        const existing = await Farmer.findOne({ registeredBy: req.user._id });
        if (existing && req.user.role?.name === 'farmer') {
            return res.status(400).json({ success: false, message: "Farmer profile already exists" });
        }

        const data = {
            ...req.body,
            registeredBy: req.body.registeredBy || req.user._id
        };

        const farmer = await Farmer.create(data);
        logger.info(`Farmer created: ${farmer.name}`);
        res.status(201).json({ success: true, data: farmer });
    } catch (err) {
        next(err);
    }
};

// @desc    Update farmer profile
// @route   PUT /api/farmers/profile (for farmer) or /api/farmers/:id (for official)
// @access  Private
exports.updateFarmer = async (req, res, next) => {
    try {
        const id = req.params.id;
        const query = id ? { _id: id } : { registeredBy: req.user._id };
        
        const farmer = await Farmer.findOneAndUpdate(query, req.body, { 
            new: true, 
            runValidators: true 
        });

        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
        res.status(200).json({ success: true, data: farmer });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a farmer
// @route   DELETE /api/farmers/:id
// @access  Admin
exports.deleteFarmer = async (req, res, next) => {
    try {
        const farmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
        res.status(200).json({ success: true, message: 'Farmer deleted' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get farmer's submission history
// @route   GET /api/farmers/history
// @access  Farmer
exports.getFarmerHistory = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOne({ registeredBy: req.user._id });
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        const submissions = await Submission.find({ farmer: farmer._id })
            .populate("plot", "name cropType")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: submissions.length, data: submissions });
    } catch (error) {
        next(error);
    }
};