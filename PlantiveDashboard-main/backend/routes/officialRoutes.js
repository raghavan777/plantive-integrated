const express = require('express');
const router = express.Router();
const { getOfficials, getOfficialProfile } = require('../controllers/officialController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

// Individual Profile Route
router.get('/profile', getOfficialProfile);

// Generic Staff Routes
router.route('/')
    .get(authorizeRoles('admin'), getOfficials);

module.exports = router;
