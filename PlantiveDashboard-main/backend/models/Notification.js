const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['damage_alert', 'submission_verified', 'submission_rejected', 'ai_analysis_complete', 'report_ready', 'system', 'mention', 'assignment'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    data: {
        // Related entity references
        entityType: String,
        entityId: mongoose.Schema.Types.ObjectId,
        url: String,
        actionRequired: Boolean,
        actionType: String,
        actionData: mongoose.Schema.Types.Mixed
    },
    readStatus: {
        isRead: {
            type: Boolean,
            default: false
        },
        readAt: Date
    },
    deliveryStatus: {
        inApp: {
            sent: { type: Boolean, default: true },
            sentAt: { type: Date, default: Date.now }
        },
        push: {
            sent: { type: Boolean, default: false },
            sentAt: Date,
            deviceTokens: [String]
        },
        email: {
            sent: { type: Boolean, default: false },
            sentAt: Date,
            emailId: String
        }
    },
    expiresAt: Date,
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Indexes
notificationSchema.index({ recipient: 1, 'readStatus.isRead': 1, createdAt: -1 });
notificationSchema.index({ type: 1, priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

// Mark as read method
notificationSchema.methods.markAsRead = async function () {
    if (!this.readStatus.isRead) {
        this.readStatus.isRead = true;
        this.readStatus.readAt = new Date();
        await this.save();
    }
    return this;
};

module.exports = mongoose.model('Notification', notificationSchema);