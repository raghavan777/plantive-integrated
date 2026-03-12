const express = require('express');
const router = express.Router();
const { getSubmissions, getSubmission, createSubmission, verifySubmission } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `submission-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);

router.route('/')
    .get(getSubmissions)
    .post(upload.array('images', 10), createSubmission);

router.route('/:id')
    .get(getSubmission);

router.put('/:id/verify', authorizeRoles('admin', 'agriofficer'), verifySubmission);

module.exports = router;