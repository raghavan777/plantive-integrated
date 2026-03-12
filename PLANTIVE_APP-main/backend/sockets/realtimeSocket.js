let ioInstance;

exports.initSockets = (io) => {
    ioInstance = io;

    io.on("connection", (socket) => {
        console.log("🟢 Client connected:", socket.id || "Unknown ID");

        socket.on("disconnect", () => {
            console.log("🔴 Client disconnected:", socket.id);
        });
    });
};

exports.emitSubmissionUpdate = (data) => {
    if (ioInstance) ioInstance.emit("submission_update", data);
};

exports.emitVerificationAlert = (data) => {
    if (ioInstance) ioInstance.emit("verification_alert", data);
};

exports.emitNotification = (userId, notification) => {
    if (ioInstance)
        ioInstance.to(userId.toString()).emit("notification", notification);
};
