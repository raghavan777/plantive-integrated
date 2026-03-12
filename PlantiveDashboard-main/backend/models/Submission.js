const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    submissionId: {
        type: String,
        unique: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmer',
        required: [true, 'Farmer reference is required'],
        index: true
    },
    plot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plot',
        required: [true, 'Plot reference is required'],
        index: true
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Submitter reference is required']
    },
    submissionType: {
        type: String,
        enum: ['routine_inspection', 'damage_report', 'harvest_report', 'planting_report', 'treatment_application', 'other'],
        required: true
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
    }],
    description: {
        type: String,
        trim: true
    },
    location: {
        coordinates: [Number], // [longitude, latitude]
        accuracy: Number, // GPS accuracy in meters
        capturedAt: Date
    },
    data: {
        // Flexible schema for different submission types
        pestObserved: Boolean,
        pestType: String,
        pestSeverity: {
            type: String,
            enum: ['low', 'medium', 'high', 'severe']
        },
        diseaseObserved: Boolean,
        diseaseType: String,
        diseaseSeverity: {
            type: String,
            enum: ['low', 'medium', 'high', 'severe']
        },
        damagePercentage: {
            type: Number,
            min: 0,
            max: 100
        },
        estimatedYield: Number,
        yieldUnit: String,
        treatmentApplied: Boolean,
        treatmentDetails: String,
        weatherConditions: String,
        soilConditions: String,
        notes: String
    },
    status: {
        type: String,
        enum: ['pending', 'under_review', 'verified', 'rejected', 'needs_info'],
        default: 'pending',
        index: true
    },
    verification: {
        verifiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        verifiedAt: Date,
        notes: String,
        rejectionReason: String,
        confidenceScore: Number // AI confidence if applicable
    },
    aiAnalysis: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AIResult'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Indexes
submissionSchema.index({ status: 1, createdAt: -1 });
submissionSchema.index({ farmer: 1, createdAt: -1 });
submissionSchema.index({ plot: 1, createdAt: -1 });
submissionSchema.index({ priority: 1, status: 1 });

// Pre-save to generate submissionId
submissionSchema.pre('save', async function (next) {
    if (!this.submissionId) {
        const date = new Date();
        const prefix = 'SUB';
        const timestamp = date.getTime().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 5).toUpperCase();
        this.submissionId = `${prefix}-${timestamp}-${random}`;
    }
    next();
});

module.exports = mongoose.model('Submission', submissionSchema);