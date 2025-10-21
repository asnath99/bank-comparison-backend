const express = require('express');
const controller = require('../controllers/bankController');
const { validateBank } = require('../middleware/validateBank');
const { requireAdmin, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', controller.getAllBanks);
router.get('/search', controller.searchBanks);
router.get('/:id', controller.getBankById);

// Routes d'administration
router.get('/all/admin', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getAllBanksForAdmin);
router.post('/', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBank, controller.createBank);
router.put('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBank, controller.updateBank);
router.delete('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.disableBank);
router.patch('/:id/reactivate', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.reactivateBank);
router.delete('/:id/permanent', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.permanentlyDeleteBank);

module.exports = router;