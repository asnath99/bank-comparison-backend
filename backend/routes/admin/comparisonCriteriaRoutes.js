// routes/admin/comparisonCriteria.js
const express = require('express');
const router = express.Router();
const comparisonCriteriaController = require('../../controllers/admin/comparisonCriteriaController');

// Routes CRUD
router.get('/', comparisonCriteriaController.getAll);       
router.post('/', comparisonCriteriaController.create);      
router.put('/:id', comparisonCriteriaController.update);   
router.delete('/:id', comparisonCriteriaController.remove);

module.exports = router;

