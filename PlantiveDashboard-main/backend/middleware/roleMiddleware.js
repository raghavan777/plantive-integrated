const logger = require('../utils/logger');

/**
 * Check if user has required permission
 * @param {String} permission - Required permission
 */
const requirePermission = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userPermissions = req.user.role?.permissions || [];

        if (!userPermissions.includes(permission) && !userPermissions.includes('admin:*')) {
            logger.warn(`User ${req.user._id} attempted unauthorized access: ${permission}`);
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

/**
 * Check if user has any of the required permissions
 * @param {Array} permissions - Array of permissions, any one grants access
 */
const requireAnyPermission = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userPermissions = req.user.role?.permissions || [];
        const hasPermission = permissions.some(p =>
            userPermissions.includes(p) || userPermissions.includes('admin:*')
        );

        if (!hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

/**
 * Check if user has all required permissions
 * @param {Array} permissions - Array of permissions, all required
 */
const requireAllPermissions = (permissions) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const userPermissions = req.user.role?.permissions || [];
        const hasAllPermissions = permissions.every(p =>
            userPermissions.includes(p) || userPermissions.includes('admin:*')
        );

        if (!hasAllPermissions) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

/**
 * Check if user is admin or superadmin
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required'
        });
    }

    const roleName = req.user.role?.name;
    if (!['district_officer'].includes(roleName)) {
        return res.status(403).json({
            success: false,
            message: 'District Officer access required'
        });
    }

    next();
};

/**
 * Check if user is owner or has specific permission
 * @param {Function} getOwnerId - Function to extract owner ID from request
 * @param {String} permission - Fallback permission if not owner
 */
const requireOwnerOrPermission = (getOwnerId, permission) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const ownerId = await getOwnerId(req);
        const isOwner = ownerId && ownerId.toString() === req.user._id.toString();
        const hasPermission = req.user.role?.permissions?.includes(permission) ||
            req.user.role?.permissions?.includes('admin:*');

        if (!isOwner && !hasPermission) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action'
            });
        }

        next();
    };
};

/**
 * Check if user has specific role
 * @param {...String} roles - Roles allowed to access
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        const roleName = req.user.role?.name || req.user.role; // Handle both object and string role formats
        if (!roles.includes(roleName) && !['district_officer'].includes(roleName)) {
            return res.status(403).json({
                success: false,
                message: 'Role is not allowed to access this resource'
            });
        }

        next();
    };
};

module.exports = {
    requirePermission,
    requireAnyPermission,
    requireAllPermissions,
    requireAdmin,
    requireOwnerOrPermission,
    authorizeRoles
};