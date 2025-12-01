// routes/comparison.js
const express = require('express');
const router = express.Router();
const ComparisonController = require('../controllers/ComparisonController');

router.get('/criteria', ComparisonController.getPublicCriteria);
router.post('/', ComparisonController.compareBankProducts);

module.exports = router;