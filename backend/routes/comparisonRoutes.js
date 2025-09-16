// routes/comparison.js
const express = require('express');
const router = express.Router();
const ComparisonController = require('../controllers/ComparisonController');

router.post('/', ComparisonController.compare);

module.exports = router;