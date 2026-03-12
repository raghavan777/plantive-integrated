const Plot = require('../models/Plot');

// GET /api/plots - List all plots for the current farmer
const getPlots = async (req, res, next) => {
    try {
        const filter = {};
        if (req.user.roleName === 'farmer') {
            // Farmers only see their own plots
            const Farmer = require('../models/Farmer');
            const farmer = await Farmer.findOne({ registeredBy: req.user._id });
            if (farmer) {
                filter._id = { $in: farmer.plots };
            }
        }
        const plots = await Plot.find(filter).populate('farmer', 'name');
        res.json({ success: true, count: plots.length, data: plots });
    } catch (error) {
        next(error);
    }
};

// GET /api/plots/:id - Get a single plot
const getPlot = async (req, res, next) => {
    try {
        const plot = await Plot.findById(req.params.id).populate('farmer', 'name');
        if (!plot) {
            return res.status(404).json({ success: false, message: 'Plot not found' });
        }
        res.json({ success: true, data: plot });
    } catch (error) {
        next(error);
    }
};

// POST /api/plots - Create a new plot
const createPlot = async (req, res, next) => {
    try {
        const plot = await Plot.create(req.body);
        res.status(201).json({ success: true, data: plot });
    } catch (error) {
        next(error);
    }
};

// PUT /api/plots/:id - Update a plot
const updatePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!plot) {
            return res.status(404).json({ success: false, message: 'Plot not found' });
        }
        res.json({ success: true, data: plot });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/plots/:id - Delete a plot
const deletePlot = async (req, res, next) => {
    try {
        const plot = await Plot.findByIdAndDelete(req.params.id);
        if (!plot) {
            return res.status(404).json({ success: false, message: 'Plot not found' });
        }
        res.json({ success: true, message: 'Plot deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = { getPlots, getPlot, createPlot, updatePlot, deletePlot };
