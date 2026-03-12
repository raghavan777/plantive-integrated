const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        // req.user.roleName is set by authMiddleware after populating the role ObjectId
        if (!allowedRoles.includes(req.user.roleName)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
            });
        }

        next();
    };
};

// Specific role middlewares for convenience
const farmerOnly = roleMiddleware('farmer');
const officialOnly = roleMiddleware('district_officer');
const adminOnly = roleMiddleware('district_officer'); // backwards-compat alias

module.exports = {
    roleMiddleware,
    farmerOnly,
    officialOnly,
    adminOnly
};