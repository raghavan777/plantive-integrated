const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Handle specific MongoDB errors
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || 'value';
    const message = `Duplicate field value: ${value}. Please use another value.`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired. Please log in again.', 401);

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method,
        user: req.user?._id
    });

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: err,
            stack: err.stack
        });
    }

    // Production error response
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Programming or unknown errors
    return res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
};

// Async handler wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// 404 handler
const notFound = (req, res, next) => {
    const error = new AppError(`Not found - ${req.originalUrl}`, 404);
    next(error);
};

module.exports = {
    AppError,
    errorHandler,
    asyncHandler,
    notFound,
    handleCastErrorDB,
    handleDuplicateFieldsDB,
    handleValidationErrorDB,
    handleJWTError,
    handleJWTExpiredError
};