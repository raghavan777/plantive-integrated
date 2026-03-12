const express = require('express');
const router = express.Router();
const { getFarmers, getFarmer, createFarmer, updateFarmer, deleteFarmer } = require('../controllers/farmerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
    .get(getFarmers)
    .post(authorizeRoles('admin', 'agriofficer'), createFarmer);

router.route('/:id')
    .get(getFarmer)
    .put(authorizeRoles('admin', 'agriofficer'), updateFarmer)
    .delete(authorizeRoles('admin'), deleteFarmer);

module.exports = router;