const Submission = require('../models/Submission');
const Farmer = require('../models/Farmer');
const Plot = require('../models/Plot');
const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Admin
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Resolve role IDs for counting officers
        const officerRoles = await Role.find({ 
            name: { $in: ['agriofficer', 'district_officer'] } 
        }, '_id');
        const roleIds = officerRoles.map(r => r._id);

        const [
            totalFarmers,
            totalSubmissions,
            totalPlots,
            totalOfficers
        ] = await Promise.all([
            Farmer.countDocuments(),
            Submission.countDocuments(),
            Plot.countDocuments(),
            User.countDocuments({ role: { $in: roleIds } })
        ]);

        const damageCases = await Submission.countDocuments({ 
            $or: [
                { submissionType: 'damage_report' },
                { 'verification.stage': 'inspection' }
            ]
        });

        const pendingApprovals = await Submission.countDocuments({ status: 'pending' });
        const completedVisits = await Submission.countDocuments({ status: 'verified' });

        // Calculate total area
        const plots = await Plot.find({}, 'area.value');
        const totalArea = plots.reduce((sum, plot) => sum + (plot.area?.value || 0), 0);

        // Recent activity
        const recentSubmissions = await Submission.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('farmer', 'name')
            .populate('plot', 'plotId');

        const recentActivity = recentSubmissions.map(sub => ({
            id: sub._id,
            type: sub.submissionType,
            title: sub.submissionType === 'damage_report' ? 'Damage reported' : 'New submission',
            description: `${sub.farmer?.name || 'Farmer'} submitted ${sub.submissionType.replace('_', ' ')} for ${sub.plot?.plotId || 'Plot'}`,
            time: sub.createdAt,
            status: sub.status === 'verified' ? 'operational' : (sub.status === 'pending' ? 'pending' : 'warning'),
            icon: sub.submissionType === 'damage_report' ? '⚠️' : '📸'
        }));

        // Calculate regional coverage (count of plots per district)
        const regionalStats = await Plot.aggregate([
            {
                $group: {
                    _id: '$district',
                    count: { $sum: 1 },
                    totalArea: { $sum: '$area.value' }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 4 }
        ]);

        const regionalCoverage = regionalStats.map(stat => ({
            name: stat._id || 'Other',
            percentage: totalArea > 0 ? Math.round((stat.totalArea / totalArea) * 100) : 0
        }));

        res.status(200).json({
            success: true,
            data: {
                totalFarmers,
                imagesAnalyzed: totalSubmissions,
                activeOfficers: totalOfficers,
                damageCases,
                pendingApprovals,
                completedVisits,
                totalArea: parseFloat(totalArea.toFixed(1)),
                aiAccuracy: 94.7, 
                recentActivity,
                regionalCoverage,
                systemStatus: {
                    aiAnalysis: { status: 'operational', latency: '120ms' },
                    imageProcessing: { status: 'operational', queue: 0 },
                    dataSync: { status: 'active', lastSync: new Date() },
                    apiHealth: { status: 'healthy', uptime: '99.9%' }
                }
            }
        });
    } catch (err) {
        next(err);
    }
};
