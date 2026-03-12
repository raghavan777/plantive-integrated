const express = require("express");
const {
    createFarm,
    getFarms
} = require("../controllers/farmController.js");

const { authMiddleware: protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", protect, createFarm);
router.get("/", protect, getFarms);

module.exports = router;