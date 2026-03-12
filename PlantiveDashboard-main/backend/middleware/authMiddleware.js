const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user still exists
            const user = await User.findById(decoded.id).populate('role');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User no longer exists'
                });
            }

            // Check if user is active
            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'User account is deactivated'
                });
            }

            // Check if password was changed after token was issued
            if (user.changedPasswordAfter(decoded.iat)) {
                return res.status(401).json({
                    success: false,
                    message: 'Password recently changed. Please log in again'
                });
            }

            // Grant access
            req.user = user;
            next();
        } catch (error) {
            logger.error('Token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        logger.error('Auth middleware error:', error);
        next(error);
    }
};

// Optional auth - doesn't fail if no token, but adds user to req if token exists
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decoded.id).populate('role');
                if (user && user.isActive) {
                    req.user = user;
                }
            } catch (error) {
                // Silently fail for optional auth
            }
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { protect, optionalAuth };