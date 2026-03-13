const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
    submissionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true,
        unique: true
    },
    officialId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Official',
        required: true
    },
    result: {
        type: String,
        enum: ['verified', 'rejected', 'requires_visit', 'pending'],
        required: true
    },
    remarks: {
        type: String,
        maxlength: [1000, 'Remarks cannot exceed 1000 characters']
    },
    verifiedAt: {
        type: Date,
        default: Date.now
    },
    verificationMethod: {
        type: String,
        enum: ['image_analysis', 'field_visit', 'remote_sensing', 'ai_assisted'],
        default: 'image_analysis'
    },
    fieldVisitRequired: {
        type: Boolean,
        default: false
    },
    fieldVisitDate: Date,
    fieldVisitNotes: String,
    cropHealthVerified: {
        type: String,
        enum: ['excellent', 'good', 'fair', 'poor', 'diseased']
    },
    yieldEstimate: {
        value: Number,
        unit: {
            type: String,
            enum: ['quintals', 'tons', 'kg']
        },
        perAcre: Boolean
    },
    recommendations: [{
        type: String,
        maxlength: [500, 'Recommendation cannot exceed 500 characters']
    }],
    attachments: [{
        type: String // URLs to additional verification documents/images
    }],
    aiConfidenceScore: Number,
    overrideReason: String // If official overrides AI recommendation
}, {
    timestamps: true
});

// Indexes
verificationSchema.index({ officialId: 1, verifiedAt: -1 });
verificationSchema.index({ submissionId: 1 });
verificationSchema.index({ result: 1, verifiedAt: -1 });

module.exports = mongoose.model('Verification', verificationSchema);
