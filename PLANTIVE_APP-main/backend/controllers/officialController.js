const Official = require("../models/Official");

const getOfficialProfile = async (req, res, next) => {
    try {

        const official = await Official.findOne({ userId: req.user._id });

        res.json(official);

    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOfficialProfile
};