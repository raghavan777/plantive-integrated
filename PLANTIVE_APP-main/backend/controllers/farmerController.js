const Farmer = require("../models/Farmer");
const Submission = require("../models/Submission");

// GET /api/farmers/profile - Get the logged-in farmer's profile
const getFarmerProfile = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOne({ registeredBy: req.user._id })
            .populate("plots", "name cropType status healthStatus area");

        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        res.json({ success: true, data: farmer });
    } catch (error) {
        next(error);
    }
};

// POST /api/farmers - Create a farmer profile for the logged-in user
const createFarmerProfile = async (req, res, next) => {
    try {
        const existing = await Farmer.findOne({ registeredBy: req.user._id });
        if (existing) {
            return res.status(400).json({ success: false, message: "Farmer profile already exists" });
        }

        const { name, address, district, state, village, phone, email, coordinates } = req.body;

        const farmer = await Farmer.create({
            name,
            location: {
                address,
                district,
                region: state,
                village,
                coordinates: coordinates || []
            },
            contact: {
                phone,
                email
            },
            registeredBy: req.user._id
        });

        res.status(201).json({ success: true, data: farmer });
    } catch (error) {
        next(error);
    }
};

// PUT /api/farmers/profile - Update farmer profile
const updateFarmerProfile = async (req, res, next) => {
    try {
        const { name, address, district, state, village, phone, email, coordinates } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (address || district || state || village || coordinates) {
            updateData.location = {
                ...(address && { address }),
                ...(district && { district }),
                ...(state && { region: state }),
                ...(village && { village }),
                ...(coordinates && { coordinates })
            };
        }
        if (phone || email) {
            updateData.contact = {
                ...(phone && { phone }),
                ...(email && { email })
            };
        }

        const farmer = await Farmer.findOneAndUpdate(
            { registeredBy: req.user._id },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        res.json({ success: true, data: farmer });
    } catch (error) {
        next(error);
    }
};

// GET /api/farmers/history - Get farmer's submission history
const getFarmerHistory = async (req, res, next) => {
    try {
        const farmer = await Farmer.findOne({ registeredBy: req.user._id });
        if (!farmer) {
            return res.status(404).json({ success: false, message: "Farmer profile not found" });
        }

        const submissions = await Submission.find({ farmer: farmer._id })
            .populate("plot", "name cropType")
            .sort({ createdAt: -1 });

        res.json({ success: true, count: submissions.length, data: submissions });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getFarmerProfile,
    createFarmerProfile,
    updateFarmerProfile,
    getFarmerHistory
};