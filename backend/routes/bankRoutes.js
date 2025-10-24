const express = require('express');
const controller = require('../controllers/bankController');
const bankAccountController = require('../controllers/bankaccountController');
const bankCardController = require('../controllers/bankcardController');
const { validateBank } = require('../middleware/validateBank');
const { requireAdmin, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', controller.getAllBanks);
router.get('/search', controller.searchBanks);

// Routes d'administration (must be before /:id to avoid route collision)
router.get('/all/admin', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getAllBanksForAdmin);

// Related resources routes (must be before /:id to avoid collision)
router.get('/:bankId/bank-accounts', bankAccountController.getAccountsByBankPublic);
router.get('/:bankId/bank-cards', bankCardController.getCardsByBankPublic);

// Dynamic routes (must be last)
router.get('/:id', controller.getBankById);
router.post('/', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBank, controller.createBank);
router.put('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBank, controller.updateBank);
router.delete('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.disableBank);
router.patch('/:id/reactivate', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.reactivateBank);
router.delete('/:id/permanent', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.permanentlyDeleteBank);

module.exports = router;