const express = require('express');
const router = express.Router();
const { 
    getSubmissions, 
    getSubmission, 
    createSubmission, 
    verifySubmission,
    getSubmissionHistory,
    getSubmissionStatus
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

// Farmer Specific Routes (priority over generic :id)
router.get('/history', getSubmissionHistory);
router.get('/status', getSubmissionStatus);

// Generic CRUD Routes
router.route('/')
    .get(getSubmissions)
    .post(createSubmission); // Both farmer and staff can submit

router.route('/:id')
    .get(getSubmission)
    .put(authorizeRoles('admin', 'agriofficer'), verifySubmission);

// Mobile Compatibility Alias
router.put('/:id/verify', authorizeRoles('admin', 'agriofficer'), verifySubmission);

module.exports = router;