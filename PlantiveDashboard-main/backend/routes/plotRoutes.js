const express = require('express');
const router = express.Router();
const { getPlots, getPlot, createPlot, updatePlot, deletePlot, getPlotsGeoJSON } = require('../controllers/plotController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/geojson', getPlotsGeoJSON);

router.route('/')
    .get(getPlots)
    .post(authorizeRoles('admin', 'agriofficer'), createPlot);

router.route('/:id')
    .get(getPlot)
    .put(authorizeRoles('admin', 'agriofficer'), updatePlot)
    .delete(authorizeRoles('admin'), deletePlot);

module.exports = router;