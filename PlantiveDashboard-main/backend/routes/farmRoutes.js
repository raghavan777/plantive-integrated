const express = require("express");
const { createFarm, getMyFarms } = require("../controllers/farmController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", protect, createFarm);
router.get("/my-farms", protect, getMyFarms);

module.exports = router;
