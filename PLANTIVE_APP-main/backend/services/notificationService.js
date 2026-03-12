import Notification from "../models/Notification.js";

export const sendNotification = async (userId, message, type = "info") => {
    const notification = await Notification.create({
        userId,
        message,
        type,
        readStatus: false,
        createdAt: new Date(),
    });
    return notification;
};

export const getUserNotifications = async (userId) => {
    return await Notification.find({ userId }).sort({ createdAt: -1 });
};
