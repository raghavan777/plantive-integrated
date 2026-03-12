const mongoose = require('mongoose');

const plotSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: [true, 'Farmer reference is required'],
        index: true
    },
    plotId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: [true, 'Plot name is required'],
        trim: true
    },
    coordinates: {
        type: {
            type: String,
            enum: ['Point', 'Polygon', 'MultiPolygon'],
            default: 'Polygon'
        },
        coordinates: {
            type: mongoose.Schema.Types.Mixed, // Array of coordinates based on type
            required: true
        }
    },
    centerPoint: {
        type: [Number], // [longitude, latitude] for quick map display
    },
    area: {
        value: {
            type: Number,
            required: [true, 'Area value is required']
        },
        unit: {
            type: String,
            enum: ['hectares', 'acres', 'square_meters'],
            default: 'hectares'
        }
    },
    cropType: {
        type: String,
        required: [true, 'Crop type is required'],
        trim: true,
        index: true
    },
    cropVariety: String,
    plantingDate: Date,
    expectedHarvestDate: Date,
    healthStatus: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'critical', 'unknown'],
        default: 'unknown',
        index: true
    },
    healthScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null
    },
    soilType: String,
    irrigationType: {
        type: String,
        enum: ['rainfed', 'sprinkler', 'drip', 'flood', 'none', 'other']
    },
    status: {
        type: String,
        enum: ['active', 'fallow', 'harvested', 'abandoned', 'preparation'],
        default: 'active'
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    lastInspection: Date,
    nextInspectionDue: Date,
    riskLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'critical'],
        default: 'low'
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Geospatial indexes
plotSchema.index({ coordinates: '2dsphere' });
plotSchema.index({ centerPoint: '2dsphere' });

// Compound indexes for common queries
plotSchema.index({ farmer: 1, status: 1 });
plotSchema.index({ cropType: 1, healthStatus: 1 });

// Pre-save middleware to generate plotId
plotSchema.pre('save', async function (next) {
    if (!this.plotId) {
        const count = await mongoose.model('Plot').countDocuments();
        this.plotId = `PLOT-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Plot', plotSchema);