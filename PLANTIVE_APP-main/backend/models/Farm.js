const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
    farmerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide farm name'],
        trim: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: [true, 'Please provide coordinates']
        }
    },
    address: {
        type: String,
        trim: true
    },
    cropType: {
        type: String,
        required: [true, 'Please provide crop type'],
        trim: true
    },
    cropVariety: {
        type: String,
        trim: true
    },
    area: {
        value: {
            type: Number,
            required: [true, 'Please provide farm area']
        },
        unit: {
            type: String,
            enum: ['acres', 'hectares', 'sq_meters'],
            default: 'acres'
        }
    },
    soilType: {
        type: String,
        trim: true
    },
    irrigationType: {
        type: String,
        enum: ['rainfed', 'canal', 'tubewell', 'drip', 'sprinkler', 'other'],
        default: 'rainfed'
    },
    plantingDate: {
        type: Date
    },
    expectedHarvestDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    documents: [{
        type: String, // URLs to land documents
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Geospatial index for location-based queries
farmSchema.index({ location: '2dsphere' });

// Index for farmer queries
farmSchema.index({ farmerId: 1, isActive: 1 });

module.exports = mongoose.model('Farm', farmSchema);