const bankService = require('../service/bank.service');
const adminLogService = require('../service/adminlog.service');
const { handleError } = require('../utils/errorHandler');

/**
 * Lister toutes les banques actives
 */
const getAllBanks = async (req, res) => {
  try {
    const banks = await bankService.getAllBanks();
    res.status(200).json({
      success: true,
      data: banks,
      count: banks.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Récupérer une banque par son ID
 */
const getBankById = async (req, res) => {
  try {
    const bank = await bankService.getBankById(req.params.id);
    res.status(200).json({
      success: true,
      data: bank
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Créer une banque
 */
const createBank = async (req, res) => {
  try {
    const bank = await bankService.createBank(req.body);
    await adminLogService.logAction(req.user.id, 'create_bank', { bankId: bank.id, bankName: bank.name });
    res.status(201).json({
      success: true,
      message: 'Banque créée avec succès',
      data: bank
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Modifier une banque
 */
const updateBank = async (req, res) => {
  try {
    const updatedBank = await bankService.updateBank(req.params.id, req.body);
    await adminLogService.logAction(req.user.id, 'update_bank', { bankId: updatedBank.id, bankName: updatedBank.name });
    res.status(200).json({
      success: true,
      message: 'Banque modifiée avec succès',
      data: updatedBank
    });
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Désactiver une banque
 */
const disableBank = async (req, res) => {
  try {
    const updatedBank = await bankService.disableBank(req.params.id);
    await adminLogService.logAction(req.user.id, 'disable_bank', { bankId: updatedBank.id, bankName: updatedBank.name });
    res.status(200).json({
      success: true,
      message: 'Banque désactivée avec succès',
      data: updatedBank
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Réactiver une banque
 */
const reactivateBank = async (req, res) => {
  try {
    const updatedBank = await bankService.reactivateBank(req.params.id);
    await adminLogService.logAction(req.user.id, 'reactivate_bank', { bankId: updatedBank.id, bankName: updatedBank.name });
    res.status(200).json({
      success: true,
      message: 'Banque réactivée avec succès',
      data: updatedBank
    });
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Rechercher des banques
 */
const searchBanks = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }
    
    const banks = await bankService.searchBanks(query.trim());
    res.status(200).json({
      success: true,
      data: banks,
      count: banks.length,
      searchTerm: query
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Supprimer définitivement une banque (hard delete)
 */
const permanentlyDeleteBank = async (req, res) => {
  try {
    const deletedBank = await bankService.permanentlyDeleteBank(req.params.id);
    await adminLogService.logAction(req.user.id, 'permanently_delete_bank', {bankId: deletedBank.id, bankName: deletedBank.name});
    res.status(200).json({
      success: true,
      message: `Banque "${deletedBank.name}" supprimée définitivement`,
      data: deletedBank
    });
  } catch (error) {
    handleError(res, error);
  }
};


module.exports = {
  getAllBanks,
  getBankById,
  createBank,
  updateBank,
  disableBank,
  reactivateBank,
  searchBanks,
  permanentlyDeleteBank
};

