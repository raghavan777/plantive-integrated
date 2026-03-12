require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./config/db');
const logger = require('./utils/logger');
const websocketService = require('./services/websocketService');
const realtimeSocket = require('./sockets/realtimeSocket');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const plotRoutes = require('./routes/plotRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const imageRoutes = require('./routes/imageRoutes');
const reportRoutes = require('./routes/reportRoutes');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// ── Ensure required directories exist ────────────────────────────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ── Socket.IO ─────────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Initialize websocket service so controllers can emit events
websocketService.initialize(io);

// Register socket event handlers
realtimeSocket(io);

// ── Global Middleware ─────────────────────────────────────────────────────────
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// ── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
    });
});

// ── API Routes ────────────────────────────────────────────────────────────────
const API = '/api';

app.use(`${API}/auth`, authRoutes);
app.use(`${API}/users`, userRoutes);
app.use(`${API}/farmers`, farmerRoutes);
app.use(`${API}/plots`, plotRoutes);
app.use(`${API}/submissions`, submissionRoutes);
app.use(`${API}/images`, imageRoutes);
app.use(`${API}/reports`, reportRoutes);
app.use(`${API}/ai`, aiRoutes);
app.use(`${API}/notifications`, notificationRoutes);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    logger.info(`🌱 Plantive backend running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    logger.info(`📡 WebSocket server ready`);
    logger.info(`📁 Uploads served at /uploads`);
});

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger.info('HTTP server closed.');
        process.exit(0);
    });
});

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason}`);
});

module.exports = { app, server, io };