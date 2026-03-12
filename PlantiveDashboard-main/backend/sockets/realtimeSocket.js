const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * realtimeSocket.js
 * Handles all Socket.IO connection lifecycle and event registration.
 * @param {import('socket.io').Server} io
 */
module.exports = (io) => {

    // ── Authentication Middleware ─────────────────────────────────────────────
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; // Attach user payload to socket
            next();
        } catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });

    // ── Connection Handler ────────────────────────────────────────────────────
    io.on('connection', (socket) => {
        const { id: userId, role } = socket.user;
        logger.info(`[Socket] Connected: ${socket.id} | User: ${userId} | Role: ${role}`);

        // Join a personal room for targeted notifications
        socket.join(`user:${userId}`);

        // Admins/Officers join a shared monitoring room
        if (['admin', 'agriofficer'].includes(role)) {
            socket.join('monitoring');
            logger.info(`[Socket] ${userId} joined monitoring room`);
        }

        // ── Subscribe to plot-specific updates ───────────────────────────────────
        socket.on('subscribe_plot', (plotId) => {
            socket.join(`plot:${plotId}`);
            socket.emit('subscribed', { room: `plot:${plotId}` });
            logger.info(`[Socket] ${userId} subscribed to plot: ${plotId}`);
        });

        socket.on('unsubscribe_plot', (plotId) => {
            socket.leave(`plot:${plotId}`);
            logger.info(`[Socket] ${userId} unsubscribed from plot: ${plotId}`);
        });

        // ── Ping/Pong health check ────────────────────────────────────────────────
        socket.on('ping', () => {
            socket.emit('pong', { timestamp: new Date().toISOString() });
        });

        // ── Disconnect ────────────────────────────────────────────────────────────
        socket.on('disconnect', (reason) => {
            logger.info(`[Socket] Disconnected: ${socket.id} | Reason: ${reason}`);
        });

        // ── Error ─────────────────────────────────────────────────────────────────
        socket.on('error', (err) => {
            logger.error(`[Socket] Error on ${socket.id}: ${err.message}`);
        });

        // ── Welcome message ───────────────────────────────────────────────────────
        socket.emit('welcome', {
            message: 'Connected to Plantive real-time server',
            userId,
            role,
            timestamp: new Date().toISOString(),
        });
    });
};