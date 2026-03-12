const Plot = require('../models/Plot');
const Farmer = require('../models/Farmer');
const { calculateArea } = require('../utils/geoUtils');
const { emitPlotUpdate } = require('../services/websocketService');
const logger = require('../utils/logger');

// @desc    Get all plots
// @route   GET /api/plots
// @access  Private
exports.getPlots = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.farmer) filter.farmer = req.query.farmer;
        if (req.query.healthStatus) filter.healthStatus = req.query.healthStatus;

        const plots = await Plot.find(filter).populate('farmer', 'name contact');
        res.status(200).json({ success: true, count: plots.length, data: plots });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single plot
// @route   GET /api/plots/:id
// @access  Private
exports.getPlot = async (req, res, next) => {
    try {
        const plot = await Plot.findById(req.params.id).populate('farmer');
        if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
        res.status(200).json({ success: true, data: plot });
    } catch (err) {
        next(err);
    }
};

// @desc    Create a plot
// @route   POST /api/plots
// @access  Admin / AgriOfficer
exports.createPlot = async (req, res, next) => {
    try {
        const { farmer: farmerId, coordinates, cropType } = req.body;

        const farmer = await Farmer.findById(farmerId);
        if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });

        // Auto-calculate area if coordinates provided
        let area = req.body.area;
        if (!area && coordinates && coordinates.length >= 3) {
            area = calculateArea(coordinates);
        }

        const plot = await Plot.create({ ...req.body, area });

        // Link plot to farmer
        farmer.plots.push(plot._id);
        await farmer.save();

        logger.info(`Plot created for farmer: ${farmerId}`);
        emitPlotUpdate({ event: 'plot_created', plot });

        res.status(201).json({ success: true, data: plot });
    } catch (err) {
        next(err);
    }
};

// @desc    Update a plot
// @route   PUT /api/plots/:id
// @access  Admin / AgriOfficer
exports.updatePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });

        emitPlotUpdate({ event: 'plot_updated', plot });
        res.status(200).json({ success: true, data: plot });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete a plot
// @route   DELETE /api/plots/:id
// @access  Admin
exports.deletePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findByIdAndDelete(req.params.id);
        if (!plot) return res.status(404).json({ success: false, message: 'Plot not found' });
        res.status(200).json({ success: true, message: 'Plot deleted' });
    } catch (err) {
        next(err);
    }
};

// @desc    Get plots as GeoJSON for map heatmaps/clusters
// @route   GET /api/plots/geojson
// @access  Private
exports.getPlotsGeoJSON = async (req, res, next) => {
    try {
        const plots = await Plot.find();
        const features = plots.map((plot) => ({
            type: 'Feature',
            geometry: { type: 'Polygon', coordinates: [plot.coordinates] },
            properties: {
                id: plot._id,
                cropType: plot.cropType,
                healthStatus: plot.healthStatus,
                area: plot.area,
            },
        }));
        res.status(200).json({ type: 'FeatureCollection', features });
    } catch (err) {
        next(err);
    }
};