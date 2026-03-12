const User = require('../models/User');
const logger = require('../utils/logger');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a user
// @route   POST /api/users
// @access  Admin
exports.createUser = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });
        logger.info(`Admin created user: ${email}`);
        res.status(201).json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Admin
exports.updateUser = async (req, res, next) => {
    try {
        const { password, ...updateData } = req.body; // Prevent password update via this route
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true }).select('-password');
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        logger.info(`User deleted: ${user.email}`);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (err) {
        next(err);
    }
};