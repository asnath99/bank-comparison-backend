const express = require('express');
const controller = require('../controllers/bankcardController');
const { validateBankCard } = require('../middleware/validateBankCard');
const { requireAdmin, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

// Routes publiques
router.get('/bank-cards', controller.getAllBankCardsPublic);
router.get('/bank-cards/search', controller.searchBankCardsPublic);
router.get('/banks/:bankId/bank-cards', controller.getCardsByBankPublic);
router.get('/bank-cards/:id', controller.getCardByIdPublic);

// Routes d'administration
router.get('/', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getAllBankCards);
router.get('/search', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.searchBankCards);
router.get('/bank/:bankId', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getCardsByBank);
router.get('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getCardById);
router.post('/', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBankCard, controller.createBankCard);
router.put('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBankCard, controller.updateBankCard);
router.delete('/:id/permanent', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.permanentlyDeleteBankCard);

module.exports = router;