const express = require("express");
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllRead,
    createNotification
} = require("../controllers/notificationController.js");

const { authMiddleware: protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/", protect, getNotifications);
router.get("/unread-count", protect, getUnreadCount);
router.put("/read-all", protect, markAllRead);
router.put("/:id/read", protect, markAsRead);
router.post("/", protect, createNotification);

module.exports = router;