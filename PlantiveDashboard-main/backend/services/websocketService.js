const logger = require('../utils/logger');

class WebSocketService {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map(); // userId -> socketId
        this.userSockets = new Map(); // socketId -> userId
    }

    initialize(io) {
        this.io = io;

        io.on('connection', (socket) => {
            logger.info(`Client connected: ${socket.id}`);

            // Authenticate socket connection
            socket.on('authenticate', (data) => {
                this.handleAuthentication(socket, data);
            });

            // Join room for specific entity updates
            socket.on('subscribe', (data) => {
                this.handleSubscription(socket, data);
            });

            // Leave room
            socket.on('unsubscribe', (data) => {
                this.handleUnsubscription(socket, data);
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                this.handleDisconnection(socket);
            });
        });

        logger.info('WebSocket service initialized');
    }

    handleAuthentication(socket, { userId, token }) {
        try {
            // Verify token logic here if needed
            this.connectedUsers.set(userId, socket.id);
            this.userSockets.set(socket.id, userId);
            socket.userId = userId;

            socket.join(`user:${userId}`);
            socket.emit('authenticated', { success: true });

            logger.info(`User ${userId} authenticated on socket ${socket.id}`);
        } catch (error) {
            socket.emit('authenticated', { success: false, error: error.message });
        }
    }

    handleSubscription(socket, { type, id }) {
        const room = `${type}:${id}`;
        socket.join(room);
        socket.emit('subscribed', { type, id, room });
        logger.debug(`Socket ${socket.id} subscribed to ${room}`);
    }

    handleUnsubscription(socket, { type, id }) {
        const room = `${type}:${id}`;
        socket.leave(room);
        socket.emit('unsubscribed', { type, id, room });
    }

    handleDisconnection(socket) {
        const userId = this.userSockets.get(socket.id);
        if (userId) {
            this.connectedUsers.delete(userId);
            this.userSockets.delete(socket.id);
        }
        logger.info(`Client disconnected: ${socket.id}`);
    }

    // Send notification to specific user
    sendToUser(userId, event, data) {
        if (this.io) {
            this.io.to(`user:${userId}`).emit(event, data);
        }
    }

    // Send notification to all users with specific role
    sendToRole(role, event, data) {
        if (this.io) {
            this.io.to(`role:${role}`).emit(event, data);
        }
    }

    // Broadcast to all connected clients
    broadcast(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }

    // Send to specific room
    sendToRoom(room, event, data) {
        if (this.io) {
            this.io.to(room).emit(event, data);
        }
    }

    // Get online users count
    getOnlineCount() {
        return this.connectedUsers.size;
    }

    // Check if user is online
    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }
}

module.exports = new WebSocketService();