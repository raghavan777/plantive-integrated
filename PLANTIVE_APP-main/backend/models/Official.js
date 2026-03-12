const mongoose = require('mongoose');

const officialSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    department: {
        type: String,
        required: [true, 'Please provide department'],
        trim: true
    },
    designation: {
        type: String,
        required: [true, 'Please provide designation'],
        trim: true
    },
    employeeId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    assignedDistricts: [{
        type: String,
        required: [true, 'Please provide at least one assigned district']
    }],
    assignedStates: [{
        type: String
    }],
    verificationCount: {
        type: Number,
        default: 0
    },
    pendingVerifications: {
        type: Number,
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    specialization: [{
        type: String,
        enum: ['crops', 'soil', 'pesticides', 'irrigation', 'general']
    }]
}, {
    timestamps: true
});

// Index for efficient queries
officialSchema.index({ assignedDistricts: 1 });
officialSchema.index({ isAvailable: 1 });

module.exports = mongoose.model('Official', officialSchema);