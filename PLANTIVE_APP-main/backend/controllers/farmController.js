const Farm = require("../models/Farm");

const createFarm = async (req, res, next) => {
    try {

        const farm = await Farm.create({
            farmerId: req.user._id,
            location: req.body.location,
            cropType: req.body.cropType,
            area: req.body.area
        });

        res.status(201).json(farm);

    } catch (error) {
        next(error);
    }
};

const getFarms = async (req, res, next) => {
    try {

        const farms = await Farm.find({ farmerId: req.user._id });

        res.json(farms);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    createFarm,
    getFarms
};