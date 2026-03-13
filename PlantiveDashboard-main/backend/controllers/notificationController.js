const Notification = require('../models/Notification');

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const filter = { recipient: userId };
        
        if (req.query.unread === 'true') {
            filter['readStatus.isRead'] = false;
        }

        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (err) {
        next(err);
    }
};

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const count = await Notification.countDocuments({ 
            recipient: userId, 
            'readStatus.isRead': false 
        });
        res.status(200).json({ success: true, count });
    } catch (err) {
        next(err);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id || req.user._id },
            { 
                'readStatus.isRead': true,
                'readStatus.readAt': new Date()
            },
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
        const userId = req.user.id || req.user._id;
        await Notification.updateMany(
            { recipient: userId, 'readStatus.isRead': false }, 
            { 
                'readStatus.isRead': true,
                'readStatus.readAt': new Date()
            }
        );
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
        const notification = await Notification.findOneAndDelete({ 
            _id: req.params.id, 
            recipient: req.user.id || req.user._id 
        });
        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.status(200).json({ success: true, message: 'Notification deleted' });
    } catch (err) {
        next(err);
    }
};