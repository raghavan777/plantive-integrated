const Report = require('../models/Report');
const { generateReportData } = require('../services/reportService');
const logger = require('../utils/logger');

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res, next) => {
    try {
        const reports = await Report.find().populate('generatedBy', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reports.length, data: reports });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single report
// @route   GET /api/reports/:id
// @access  Private
exports.getReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id).populate('generatedBy', 'name email');
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        res.status(200).json({ success: true, data: report });
    } catch (err) {
        next(err);
    }
};

// @desc    Generate and save a report
// @route   POST /api/reports
// @access  Admin / AgriOfficer
exports.createReport = async (req, res, next) => {
    try {
        const { title, type, filters } = req.body;

        if (!title || !type) {
            return res.status(400).json({ success: false, message: 'Title and type are required' });
        }

        // Generate report data based on type
        const data = await generateReportData(type, filters || {});

        const report = await Report.create({
            title,
            type,
            generatedBy: req.user.id,
            filters,
            data,
        });

        logger.info(`Report created: ${title} by ${req.user.id}`);
        res.status(201).json({ success: true, data: report });
    } catch (err) {
        next(err);
    }
};

// @desc    Export report as JSON
// @route   GET /api/reports/:id/export
// @access  Private
exports.exportReport = async (req, res, next) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

        const format = req.query.format || 'json';

        if (format === 'json') {
            res.setHeader('Content-Disposition', `attachment; filename="report-${report._id}.json"`);
            res.setHeader('Content-Type', 'application/json');
            return res.send(JSON.stringify(report.data, null, 2));
        }

        if (format === 'csv') {
            // Flatten top-level data object to CSV rows
            const rows = Array.isArray(report.data) ? report.data : [report.data];
            const headers = Object.keys(rows[0] || {}).join(',');
            const csvRows = rows.map((r) => Object.values(r).join(','));
            const csv = [headers, ...csvRows].join('\n');
            res.setHeader('Content-Disposition', `attachment; filename="report-${report._id}.csv"`);
            res.setHeader('Content-Type', 'text/csv');
            return res.send(csv);
        }

        res.status(400).json({ success: false, message: 'Unsupported format. Use json or csv.' });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Admin
exports.deleteReport = async (req, res, next) => {
    try {
        const report = await Report.findByIdAndDelete(req.params.id);
        if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
        res.status(200).json({ success: true, message: 'Report deleted' });
    } catch (err) {
        next(err);
    }
};