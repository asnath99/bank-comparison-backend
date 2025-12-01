const express = require('express');
const controller = require('../controllers/bankaccountController');
const { validateBankAccount } = require('../middleware/validateBankAccount');
const { requireAdmin, authorizeRoles } = require('../middleware/auth');

const router = express.Router();
const pool = require('../db'); 



// Routes publiques
router.get('/bank-accounts', controller.getAllBankAccountsPublic);
router.get('/banks/:bankId/bank-accounts', controller.getAccountsByBankPublic);
router.get('/bank-accounts/search', controller.searchBankAccountsPublic);
router.get('/bank-accounts/:id', controller.getBankAccountByIdPublic);

// Routes d'administration
router.get('/', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getAllBankAccounts);
router.get('/search',  requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.searchBankAccounts);
router.get('/bank/:bankId', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getAccountsByBank);
router.get('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.getBankAccountById);
router.post('/', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBankAccount, controller.createBankAccount);
router.put('/:id', requireAdmin, authorizeRoles(['admin', 'super-admin']), validateBankAccount, controller.updateBankAccount);
router.delete('/:id/permanent', requireAdmin, authorizeRoles(['admin', 'super-admin']), controller.permanentlyDeleteBankAccount);

router.post('/', async (req, res) => {
  try {
    const { bank_id, type, monthly_fee, currency, notes, status } = req.body;
    const result = await pool.query(
      `INSERT INTO bank_accounts (bank_id, type, monthly_fee, currency, notes, status, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
       RETURNING *`,
      [bank_id, type, monthly_fee, currency, notes, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur serveur");
  }
});


module.exports = router;