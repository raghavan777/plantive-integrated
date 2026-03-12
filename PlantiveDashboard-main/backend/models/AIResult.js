const mongoose = require('mongoose');

const aiResultSchema = new mongoose.Schema({
    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
        required: true,
        unique: true
    },
    analysisType: {
        type: String,
        enum: ['disease_detection', 'pest_detection', 'crop_health', 'yield_estimation', 'weed_detection', 'nutrient_deficiency', 'general_assessment'],
        required: true
    },
    results: [{
        label: {
            type: String,
            required: true
        },
        confidence: {
            type: Number,
            required: true,
            min: 0,
            max: 1
        },
        severity: {
            type: String,
            enum: ['none', 'low', 'medium', 'high', 'severe']
        },
        bbox: {
            x: Number,
            y: Number,
            width: Number,
            height: Number
        },
        description: String,
        treatment: String,
        prevention: String
    }],
    overallHealth: {
        score: {
            type: Number,
            min: 0,
            max: 100
        },
        status: {
            type: String,
            enum: ['excellent', 'good', 'fair', 'poor', 'critical']
        }
    },
    recommendations: [{
        type: String,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent']
        },
        action: String,
        timeframe: String
    }],
    processingTime: Number, // in milliseconds
    modelVersion: String,
    rawOutput: mongoose.Schema.Types.Mixed, // Store raw AI response for debugging
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    verifiedStatus: {
        type: String,
        enum: ['pending', 'correct', 'incorrect', 'partially_correct'],
        default: 'pending'
    },
    feedback: String
}, {
    timestamps: true
});

// Indexes
aiResultSchema.index({ analysisType: 1, createdAt: -1 });
aiResultSchema.index({ 'results.label': 1 });

module.exports = mongoose.model('AIResult', aiResultSchema);