const mongoose = require('mongoose');
const Official = require('../models/Official');
const User = require('../models/User');

// @desc    Get all officials
// @route   GET /api/officials
// @access  Admin
exports.getOfficials = async (req, res, next) => {
    try {
        const officials = await Official.find()
            .populate('userId', 'name email phone avatar lastActivity status district');
        
        // Fetch recent activities for each official
        const data = await Promise.all(officials.map(async (official) => {
            const submissions = await mongoose.model('Submission').find({ 
                'verification.verifiedBy': official.userId?._id 
            })
            .sort({ updatedAt: -1 })
            .limit(3)
            .populate('farmer', 'name')
            .populate('plot', 'cropType plotId');

            return {
                ...official.toObject(),
                recentActivities: submissions.map(s => ({
                    id: s._id,
                    title: s.submissionType === 'damage_report' ? 'Damage Assessment' : 'Farm Visit Completed',
                    description: `${s.farmer?.name || 'Farmer'} - ${s.plot?.cropType || 'Crop'}`,
                    time: s.verification?.verifiedAt || s.updatedAt
                }))
            };
        }));

        res.status(200).json({
            success: true,
            count: data.length,
            data
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get current official profile
// @route   GET /api/officials/profile
// @access  Official
exports.getOfficialProfile = async (req, res, next) => {
    try {
        const official = await Official.findOne({ userId: req.user._id })
            .populate('userId', 'name email phone avatar');

        if (!official) {
            return res.status(404).json({ success: false, message: 'Official profile not found' });
        }

        res.status(200).json({ success: true, data: official });
    } catch (err) {
        next(err);
    }
};
