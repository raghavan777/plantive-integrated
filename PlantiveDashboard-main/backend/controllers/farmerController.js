const Farmer = require('../models/Farmer');
const logger = require('../utils/logger');

// @desc    Get all farmers
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

// @desc    Get single farmer
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

// @desc    Create a farmer
// @route   POST /api/farmers
// @access  Admin / AgriOfficer
exports.createFarmer = async (req, res, next) => {
    try {
        const farmer = await Farmer.create(req.body);
        logger.info(`Farmer created: ${farmer.name}`);
        res.status(201).json({ success: true, data: farmer });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a farmer
// @route   PUT /api/farmers/:id
// @access  Admin / AgriOfficer
exports.updateFarmer = async (req, res, next) => {
    try {
        const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
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