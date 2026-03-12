const express = require("express");
const {
    getOfficialProfile
} = require("../controllers/officialController.js");

const { authMiddleware: protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.get("/profile", protect, getOfficialProfile);

module.exports = router;
