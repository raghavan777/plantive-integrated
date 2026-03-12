const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Custom validator for MongoDB ObjectId
const isObjectId = (value) => {
    return mongoose.Types.ObjectId.isValid(value);
};

// Validation error handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Auth validators
const loginValidator = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

const registerValidator = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .custom(isObjectId)
        .withMessage('Invalid role ID'),
    handleValidationErrors
];

// User validators
const updateUserValidator = [
    param('id')
        .custom(isObjectId)
        .withMessage('Invalid user ID'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 }),
    body('email')
        .optional()
        .isEmail()
        .normalizeEmail(),
    body('role')
        .optional()
        .custom(isObjectId),
    handleValidationErrors
];

// Farmer validators
const createFarmerValidator = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Farmer name is required'),
    body('location.address')
        .trim()
        .notEmpty()
        .withMessage('Address is required'),
    body('location.coordinates')
        .optional()
        .isArray({ min: 2, max: 2 })
        .withMessage('Coordinates must be [longitude, latitude]'),
    body('contact.phone')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required'),
    body('contact.email')
        .optional()
        .isEmail()
        .normalizeEmail(),
    handleValidationErrors
];

// Plot validators
const createPlotValidator = [
    body('farmer')
        .custom(isObjectId)
        .withMessage('Valid farmer ID is required'),
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Plot name is required'),
    body('coordinates.coordinates')
        .isArray()
        .withMessage('Coordinates are required'),
    body('area.value')
        .isNumeric()
        .withMessage('Area value must be a number'),
    body('cropType')
        .trim()
        .notEmpty()
        .withMessage('Crop type is required'),
    handleValidationErrors
];

// Submission validators
const createSubmissionValidator = [
    body('farmer')
        .custom(isObjectId)
        .withMessage('Valid farmer ID is required'),
    body('plot')
        .custom(isObjectId)
        .withMessage('Valid plot ID is required'),
    body('submissionType')
        .isIn(['routine_inspection', 'damage_report', 'harvest_report', 'planting_report', 'treatment_application', 'other'])
        .withMessage('Invalid submission type'),
    body('description')
        .optional()
        .trim(),
    handleValidationErrors
];

const verifySubmissionValidator = [
    param('id')
        .custom(isObjectId)
        .withMessage('Invalid submission ID'),
    body('status')
        .isIn(['verified', 'rejected', 'needs_info'])
        .withMessage('Invalid verification status'),
    body('notes')
        .optional()
        .trim(),
    body('rejectionReason')
        .optional()
        .trim(),
    handleValidationErrors
];

// Pagination validator
const paginationValidator = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('sort')
        .optional()
        .isIn(['createdAt', 'updatedAt', 'name', 'status'])
        .withMessage('Invalid sort field'),
    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Order must be asc or desc'),
    handleValidationErrors
];

module.exports = {
    isObjectId,
    handleValidationErrors,
    loginValidator,
    registerValidator,
    updateUserValidator,
    createFarmerValidator,
    createPlotValidator,
    createSubmissionValidator,
    verifySubmissionValidator,
    paginationValidator
};