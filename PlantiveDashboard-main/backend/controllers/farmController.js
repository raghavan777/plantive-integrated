const Plot = require("../models/Plot");

// @desc    Create a new farm (mapped to Plot)
// @route   POST /api/farms
// @access  Farmer
const createFarm = async (req, res, next) => {
    try {
        const { location, cropType, area, name } = req.body;

        const farm = await Plot.create({
            farmer: req.user._id,
            name: name || `Farm ${Date.now()}`,
            coordinates: {
                type: location?.type || 'Point',
                coordinates: location?.coordinates || [0, 0]
            },
            cropType,
            area: {
                value: area?.value || 0,
                unit: area?.unit || 'acres'
            }
        });

        res.status(201).json({
            success: true,
            data: farm
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all farms for a farmer
// @route   GET /api/farms/my-farms
// @access  Farmer
const getMyFarms = async (req, res, next) => {
    try {
        const farms = await Plot.find({ farmer: req.user._id });

        // Map Plot fields back to Farm fields for mobile app compatibility
        const mappedFarms = farms.map(f => ({
            _id: f._id,
            farmerId: f.farmer,
            name: f.name,
            location: f.coordinates,
            cropType: f.cropType,
            area: f.area,
            isActive: f.status === 'active'
        }));

        res.json(mappedFarms);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFarm,
    getMyFarms
};
