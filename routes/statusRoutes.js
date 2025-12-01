const express = require('express');
const router = express.Router();

// Import des contrôleurs
const bankController = require('../controllers/bankController');
const productController = require('../controllers/bankproductController');
const cardController = require('../controllers/cardController');
const accountController = require('../controllers/bankaccountController');

// --- Banks ---
router.get('/banks/active', bankController.getActiveBanks);
router.put('/banks/:id/status', bankController.updateBankStatus);

// --- Products ---
router.get('/products/active', productController.getActiveProducts);
router.put('/products/:id/status', productController.updateProductStatus);

// --- Cards ---
router.get('/cards/active', cardController.getActiveCards);
router.put('/cards/:id/status', cardController.updateCardStatus);

// --- Accounts ---
router.get('/accounts/active', accountController.getActiveAccounts);
router.put('/accounts/:id/status', accountController.updateAccountStatus);

module.exports = router;