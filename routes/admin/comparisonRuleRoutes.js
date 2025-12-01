const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/comparisonRuleController');
const { requireAdmin } = require('../../middleware/auth');

// Routes CRUD
router.get('/', requireAdmin, controller.getAll);
router.post('/', requireAdmin, controller.create);
router.put('/:id', requireAdmin, controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
