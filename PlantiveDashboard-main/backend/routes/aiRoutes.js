const express = require('express');
const router = express.Router();
const { analyzeImage, getAIResults, getAIResult } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.post('/analyze', analyzeImage);
router.get('/results', getAIResults);
router.get('/results/:id', getAIResult);

module.exports = router;