const express = require('express');
const router = express.Router();
const { getReports, getReport, createReport, exportReport, deleteReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.route('/')
    .get(getReports)
    .post(authorizeRoles('admin', 'agriofficer'), createReport);

router.get('/:id/export', exportReport);

router.route('/:id')
    .get(getReport)
    .delete(authorizeRoles('admin'), deleteReport);

module.exports = router;