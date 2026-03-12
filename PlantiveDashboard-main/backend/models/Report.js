const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Report title is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['farmers_summary', 'plots_summary', 'damage_assessment', 'yield_forecast', 'activity_log', 'custom'],
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateRange: {
        start: Date,
        end: Date
    },
    filters: {
        regions: [String],
        cropTypes: [String],
        farmers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' }],
        plots: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plot' }],
        status: [String]
    },
    data: {
        summary: mongoose.Schema.Types.Mixed,
        charts: [{
            type: String,
            title: String,
            data: mongoose.Schema.Types.Mixed,
            config: mongoose.Schema.Types.Mixed
        }],
        tables: [{
            title: String,
            headers: [String],
            rows: [mongoose.Schema.Types.Mixed]
        }],
        statistics: {
            totalFarmers: Number,
            totalPlots: Number,
            totalArea: Number,
            averageHealthScore: Number,
            criticalIssues: Number,
            pendingSubmissions: Number
        },
        details: mongoose.Schema.Types.Mixed
    },
    format: {
        type: String,
        enum: ['pdf', 'excel', 'csv', 'json'],
        default: 'pdf'
    },
    fileUrl: String,
    fileSize: Number,
    status: {
        type: String,
        enum: ['generating', 'completed', 'failed'],
        default: 'generating'
    },
    errorMessage: String,
    isScheduled: {
        type: Boolean,
        default: false
    },
    scheduleConfig: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'quarterly']
        },
        recipients: [String], // email addresses
        lastSent: Date,
        nextScheduled: Date
    },
    sharedWith: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        permissions: {
            type: String,
            enum: ['view', 'download', 'share'],
            default: 'view'
        },
        sharedAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

// Indexes
reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ type: 1, status: 1 });
reportSchema.index({ 'dateRange.start': 1, 'dateRange.end': 1 });

module.exports = mongoose.model('Report', reportSchema);