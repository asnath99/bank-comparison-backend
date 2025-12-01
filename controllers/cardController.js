const cardService = require('../service/cardService');
const { BankCard } = require('../models'); 


const addCard = async (req, res) => {
  try {
    const card = await cardService.createCard(req.body);
    res.status(201).json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const listCards = async (req, res) => {
  try {
    const cards = await cardService.getAllCards();
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Récupérer uniquement les cartes actives
const getActiveCards = async (req, res) => {
  try {
    const cards = await BankCard.findAll({ where: { status: 'active' } });
    res.json({ success: true, data: cards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mettre à jour le statut d'une carte
const updateCardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const card = await BankCard.findByPk(id);
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });

    card.status = status;
    await card.save();

    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports = {
  addCard,
  listCards,
  getActiveCards,
  updateCardStatus
};
