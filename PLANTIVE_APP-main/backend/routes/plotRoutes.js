const express = require('express');
const { getPlots, getPlot, createPlot, updatePlot, deletePlot } = require('../controllers/plotController');
const { authMiddleware: protect } = require('../middleware/authMiddleware');
const { roleMiddleware } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getPlots)
    .post(roleMiddleware('district_officer'), createPlot);

router.route('/:id')
    .get(getPlot)
    .put(roleMiddleware('district_officer'), updatePlot)
    .delete(roleMiddleware('district_officer'), deletePlot);

module.exports = router;
