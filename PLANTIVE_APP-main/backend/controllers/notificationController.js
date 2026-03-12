const Notification = require("../models/Notification");

// GET /api/notifications - Get all notifications for the logged-in user
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        next(error);
    }
};

// GET /api/notifications/unread - Get unread count
const getUnreadCount = async (req, res, next) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            "readStatus.isRead": false
        });

        res.json({ success: true, unreadCount: count });
    } catch (error) {
        next(error);
    }
};

// PUT /api/notifications/:id/read - Mark a notification as read
const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            {
                "readStatus.isRead": true,
                "readStatus.readAt": new Date()
            },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

// PUT /api/notifications/read-all - Mark all as read
const markAllRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user._id, "readStatus.isRead": false },
            { "readStatus.isRead": true, "readStatus.readAt": new Date() }
        );

        res.json({ success: true, message: "All notifications marked as read" });
    } catch (error) {
        next(error);
    }
};

// POST /api/notifications - Create a notification (used internally / by officials)
const createNotification = async (req, res, next) => {
    try {
        const { recipientId, title, message, type, priority, data } = req.body;

        const notification = await Notification.create({
            recipient: recipientId,
            title,
            message,
            type: type || "system",
            priority: priority || "normal",
            data: data || {}
        });

        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllRead,
    createNotification
};