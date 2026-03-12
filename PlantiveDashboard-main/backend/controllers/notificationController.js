const Notification = require('../models/Notification');

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const filter = { userId: req.user.id };
        if (req.query.unread === 'true') filter.readStatus = false;

        const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(50);
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { readStatus: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.status(200).json({ success: true, data: notification });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ userId: req.user.id, readStatus: false }, { readStatus: true });
        res.status(200).json({ success: true, message: 'All notifications marked as read' });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (err) {
        next(err);
    }
};