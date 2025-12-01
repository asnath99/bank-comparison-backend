const cardService = require('../service/cardService');

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

module.exports = {
  addCard,
  listCards,
};
