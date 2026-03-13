const express = require('express');
const router = express.Router();
const { 
    getFarmers, 
    getFarmer, 
    createFarmer, 
    updateFarmer, 
    deleteFarmer,
    getFarmerProfile,
    getFarmerHistory
} = require('../controllers/farmerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

// Individual Profile Routes (priority over generic :id)
router.get('/profile', getFarmerProfile);
router.put('/profile', updateFarmer); // updateFarmer handles both :id and session-based
router.get('/history', getFarmerHistory);

// Generic CRUD Routes
router.route('/')
    .get(getFarmers)
    .post(authorizeRoles('admin', 'agriofficer'), createFarmer);

router.route('/:id')
    .get(getFarmer)
    .put(authorizeRoles('admin', 'agriofficer'), updateFarmer)
    .delete(authorizeRoles('admin'), deleteFarmer);

module.exports = router;