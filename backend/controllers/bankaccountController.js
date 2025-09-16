const bankAccountService = require('../service/bankaccount.service');
const adminLogService = require('../service/adminlog.service');
const { handleError } = require('../utils/errorHandler');
const { formatBankAccountResponse } = require('../utils/currencyHelper');


/************************ Vue publique ***************************/

const getAllBankAccountsPublic = async (req, res) => {
  try {
    const rows = await bankAccountService.getAllBankAccountsPublic();
    const data = rows.map(r => formatBankAccountResponse(r.toJSON()));
    res.status(200).json({ success: true, data, count: data.length });
  } catch (e) { handleError(res, e); }
};

const getBankAccountByIdPublic = async (req, res) => {
  try {
    const row = await bankAccountService.getBankAccountByIdPublic(req.params.id);
    res.status(200).json({ success: true, data: formatBankAccountResponse(row.toJSON()) });
  } catch (e) { handleError(res, e); }
};

const getAccountsByBankPublic = async (req, res) => {
  try {
    const bankId = req.params.bankId;
    const bankaccounts = await bankAccountService.getAccountsByBankPublic(bankId);
    const formattedAccounts = bankaccounts.map(account =>
      formatBankAccountResponse(account.toJSON())
    );
    res.status(200).json({
      success: true,
      data: formattedAccounts,
      count: formattedAccounts.length
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
};



const searchBankAccountsPublic = async (req, res) => {
  try {
    const searchTerm = req.query.query || req.query.term || req.query.search || '';
    
    if (searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }

    const bankaccounts = await bankAccountService.searchBankAccountsPublic(searchTerm.trim());
    const formattedAccounts = bankaccounts.map(account => formatBankAccountResponse(account.toJSON()));
    res.status(200).json({
      success: true,
      data: formattedAccounts,
      count: formattedAccounts.length,
      searchTerm
    });
  } catch (error) {
    handleError(res, error);
  }
};


/************************ Vue Admin ***************************/

/**
 * Lister toutes les comptes
 */
const getAllBankAccounts = async (req, res) => {
  try {
    const bankaccounts = await bankAccountService.getAllBankAccounts();
    
    const formattedAccounts = bankaccounts.map(account =>
      formatBankAccountResponse(account.toJSON())
    );

    res.status(200).json({
      success: true,
      data: formattedAccounts,
      count: formattedAccounts.length
    });
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Lister tous les comptes d'une banque
 */
const getAccountsByBank = async (req, res) => {
  try {
    const bankId = req.params.bankId;
    const bankaccounts = await bankAccountService.getAccountsByBank(bankId);
    const formattedAccounts = bankaccounts.map(account =>
      formatBankAccountResponse(account.toJSON())
    );
    res.status(200).json({
      success: true,
      data: formattedAccounts,
      count: formattedAccounts.length
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
};


/**
 * Récupérer un compte par son ID
 */
const getBankAccountById = async (req, res) => {
  try {
    const bankaccount = await bankAccountService.getBankAccountById(req.params.id);
    const formattedAccount = formatBankAccountResponse(bankaccount.toJSON());
    res.status(200).json({
      success: true,
      data: formattedAccount
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Créer un compte
 */
const createBankAccount = async (req, res) => {
  try {
    const  account = await bankAccountService.createBankAccount(req.body);
    const bank = account.Bank || null;

    await adminLogService.logAction(req.user.id, 'create_bank_account', {
      accountId: account.id,
      bankId: bank?.id ?? account.bank_id,
      bankName: bank?.name ?? null,
      parentBankActive: bank?.is_active
    });
    const formattedAccount = formatBankAccountResponse(account.toJSON ? account.toJSON() : account);

    res.status(201).json({
      success: true,
      message: 'Compte crée avec succès',
      data: formattedAccount
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Modifier un compte
 */
const updateBankAccount = async (req, res) => {
  try {
    const { oldAccount, newAccount }= await bankAccountService.updateBankAccount(req.params.id, req.body);

    const oldAccountName = (oldAccount.type) || null;
    const newAccountName = (newAccount.type) || oldAccountName;
    const bank = newAccount.Bank || null;

    await adminLogService.logAction(req.user.id, 'update_bank_account', {
      accountId: newAccount.id,
      oldAccountName,
      newAccountName,
      bankId: bank?.id,
      bankName: bank?.name,
      parentBankActive: bank?.is_active
    });
    const formattedAccount = formatBankAccountResponse(newAccount.toJSON());

    res.status(200).json({
      success: true,
      message: 'Compte bancaire modifiée avec succès',
      data: formattedAccount
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Rechercher des comptes
 */
const searchBankAccounts = async (req, res) => {
  try {
    const searchTerm = req.query.query || req.query.term || req.query.search || '';
    
    if (searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }
    
    const bankaccounts = await bankAccountService.searchBankAccounts(searchTerm.trim());
    const formattedAccounts = bankaccounts.map(account => formatBankAccountResponse(account.toJSON()));    
    res.status(200).json({
      success: true,
      data: formattedAccounts,
      count: formattedAccounts.length,
      searchTerm
    });
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Supprimer définitivement un compte (hard delete)
 */
const permanentlyDeleteBankAccount = async (req, res) => {
  try {
    const deletedAccount = await bankAccountService.permanentlyDeleteBankAccount(req.params.id);
    await adminLogService.logAction(req.user.id, 'permanently_delete_account',{
      accountId: deletedAccount.id, 
      accountName: deletedAccount.name
    });
    res.status(200).json({
      success: true,
      message: `Account "${deletedAccount.type}" supprimée définitivement`,
      data: deletedAccount
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  // public
  getAllBankAccountsPublic,
  getAccountsByBankPublic,
  getBankAccountByIdPublic,
  searchBankAccountsPublic,
  // admin
  getAllBankAccounts,
  getAccountsByBank,
  getBankAccountById,
  createBankAccount,
  updateBankAccount,
  searchBankAccounts,
  permanentlyDeleteBankAccount
};

