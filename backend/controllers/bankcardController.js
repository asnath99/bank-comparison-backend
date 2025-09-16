const bankCardService = require('../service/bankcard.service');
const adminLogService = require('../service/adminlog.service');
const { handleError } = require('../utils/errorHandler');

/************************ Vue publique ***************************/
const getAllBankCardsPublic = async (req, res) => {
  try {
    const bankcards = await bankCardService.getAllBankCardsPublic();
    res.status(200).json({
      success: true,
      data: bankcards,
      count: bankcards.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getCardsByBankPublic = async (req, res) => {
  try {
    const bankId = req.params.bankId;
    const bankcards = await bankCardService.getCardsByBankPublic(bankId);
    res.status(200).json({
      success: true,
      data: bankcards,
      count: bankcards.length
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
};

const getCardByIdPublic = async (req, res) => {
  try {
    const bankcards = await bankCardService.getCardByIdPublic(req.params.id);
    res.status(200).json({
      success: true,
      data: bankcards
    });
  } catch (error) {
    handleError(res, error);
  }
};

const searchBankCardsPublic = async (req, res) => {
  try {
    const searchTerm = req.query.query || req.query.term || req.query.search || '';
    
    if (searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }
    
    const bankcards = await bankCardService.searchBankCardsPublic(searchTerm.trim());
    res.status(200).json({
      success: true,
      data: bankcards,
      count: bankcards.length,
      searchTerm
    });
  } catch (error) {
    handleError(res, error);
  }
};

/************************ Vue Admin ***************************/

/**
 * Lister toutes les cartes
 */
const getAllBankCards = async (req, res) => {
  try {
    const bankcards = await bankCardService.getAllBankCards();
    res.status(200).json({
      success: true,
      data: bankcards,
      count: bankcards.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Lister toutes les cartes d'une banque
 */
const getCardsByBank = async (req, res) => {
  try {
    const bankId = req.params.bankId;
    const bankcards = await bankCardService.getCardsByBank(bankId);
    res.status(200).json({
      success: true,
      data: bankcards,
      count: bankcards.length
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
 * Récupérer une carte par son ID
 */
const getCardById = async (req, res) => {
  try {
    const bankcards = await bankCardService.getCardById(req.params.id);
    res.status(200).json({
      success: true,
      data: bankcards
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Créer une carte
 */
const createBankCard = async (req, res) => {
  try {
    const bankcards = await bankCardService.createBankCard(req.body);
    const bank = bankcards.Bank || null;

    await adminLogService.logAction(req.user.id, 'create_bank_card', {
      cardId: bankcards.id,
      bankId: bank?.id ?? bankcards.bank_id,
      bankName: bank?.name ?? null,
      parentBankActive: bank?.is_active
    });
    res.status(201).json({
      success: true,
      message: 'Carte crée avec succès',
      data: bankcards
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Modifier une carte
 */
const updateBankCard = async (req, res) => {
  try {
    const { oldCard, newCard }= await bankCardService.updateBankCard(req.params.id, req.body);
    const oldCardName = (oldCard.card_type) || null;
    const newCardName = (newCard.card_type) || oldCardName;
    const bank = newCard.Bank || null;
    
    await adminLogService.logAction(req.user.id, 'update_bank_card', {
      cardId: newCard.id,
      oldCardName,
      newCardName,
      bankId: bank?.id,
      bankName: bank?.name,
      parentBankActive: bank?.is_active
    });
        
    res.status(200).json({
      success: true,
      message: 'Carte modifiée avec succès',
      data: newCardName
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Rechercher des cartes
 */
const searchBankCards = async (req, res) => {
  try {
    const searchTerm = req.query.query || req.query.term || req.query.search || '';
    
    if (searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }
    
    const bankcards = await bankCardService.searchBankCards(searchTerm.trim());
    res.status(200).json({
      success: true,
      data: bankcards,
      count: bankcards.length,
      searchTerm
    });
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Supprimer définitivement un compte (hard delete)
 */
const permanentlyDeleteBankCard = async (req, res) => {
  try {
    const deletedCard = await bankCardService.permanentlyDeleteBankCard(req.params.id);
    await adminLogService.logAction(req.user.id, 'permanently_delete_card',{
      cardId: deletedCard.id, 
      cardName: deletedCard.card
    });
    res.status(200).json({
      success: true,
      message: `Carte "${deletedCard.card_type}" supprimée définitivement`,
      data: deletedCard
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  // public
  getAllBankCardsPublic,
  getCardsByBankPublic,
  getCardByIdPublic,
  searchBankCardsPublic,
  // admin
  getAllBankCards,
  getCardsByBank,
  getCardById,
  createBankCard,
  updateBankCard,
  searchBankCards,
  permanentlyDeleteBankCard
};

