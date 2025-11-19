const { BankCard } = require('../models'); 

const createCard = async (cardData) => {
  try {
    const newCard = await BankCard.create(cardData);
    return newCard;
  } catch (error) {
    throw error;
  }
};

const getAllCards = async () => {
  return await BankCard.findAll();
};

module.exports = {
  createCard,
  getAllCards,
};
