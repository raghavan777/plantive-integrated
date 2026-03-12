const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    originalName: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true,
        unique: true
    },
    path: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    thumbnailUrl: String,
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    dimensions: {
        width: Number,
        height: Number
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    entityType: {
        type: String,
        enum: ['plot', 'submission', 'farmer', 'report', 'other'],
        required: true
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    location: {
        coordinates: [Number], // [longitude, latitude] from EXIF or manual
        accuracy: Number
    },
    capturedAt: Date,
    exifData: {
        camera: String,
        lens: String,
        iso: Number,
        aperture: String,
        shutterSpeed: String,
        focalLength: String,
        gps: mongoose.Schema.Types.Mixed
    },
    analysisStatus: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending'
    },
    aiResult: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AIResult'
    },
    tags: [{
        type: String,
        trim: true
    }],
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// Indexes
imageSchema.index({ entityType: 1, entityId: 1 });
imageSchema.index({ uploadedBy: 1, createdAt: -1 });
imageSchema.index({ analysisStatus: 1 });

module.exports = mongoose.model('Image', imageSchema);