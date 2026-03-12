const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');

// Load env vars
dotenv.config();

// Import database connection
const connectDB = require('./config/db');
const Role = require('./models/Role');

// Import routes
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const officialRoutes = require('./routes/officialRoutes');
const farmRoutes = require('./routes/farmRoutes');
const plotRoutes = require('./routes/plotRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const imageRoutes = require('./routes/imageRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Import middleware
const errorMiddleware = require('./middleware/errorMiddleware');
const { logger } = require('./utils/logger');

// Import socket handler
const { initSockets: initializeSockets } = require('./sockets/realtimeSocket');

// Initialize app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initializeSockets(server);

// Make io accessible to controllers
app.set('io', io);

// Security Middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS Configuration
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Plantive API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/farmers', farmerRoutes);
app.use('/api/officials', officialRoutes);
app.use('/api/farms', farmRoutes);       // kept for backward compat with mobile app
app.use('/api/plots', plotRoutes);         // new — shared with Dashboard
app.use('/api/submissions', submissionRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use(errorMiddleware);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        logger.info('MongoDB Connected');

        // Seed role documents so both apps can reference them
        await Role.initializeRoles();
        logger.info('Roles seeded/verified');

        server.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

startServer();

module.exports = { app, server, io };