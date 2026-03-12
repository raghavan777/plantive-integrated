const express = require("express");
const {
    uploadImage,
    getEntityImages,
    getSubmissionImages
} = require("../controllers/imageController.js");

const { upload } = require("../middleware/uploadMiddleware.js");
const { authMiddleware: protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/upload", protect, upload.single("image"), uploadImage);
// GET /api/images/submission/:submissionId (backward compat)
router.get("/submission/:submissionId", protect, getSubmissionImages);
// GET /api/images/:entityType/:entityId (new)
router.get("/:entityType/:entityId", protect, getEntityImages);

module.exports = router;