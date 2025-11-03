'use strict';

const { Bank } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const banks = await Bank.findAll();
    const bankNameToId = banks.reduce((acc, bank) => {
      acc[bank.name] = bank.id;
      return acc;
    }, {});

    const bankCards = [
      // Ecobank
      { bank_id: bankNameToId['Ecobank Burkina Faso'], card_type: 'Azur', fee: 1250, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Ecobank Burkina Faso'], card_type: 'Gold', fee: 1500, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Ecobank Burkina Faso'], card_type: 'Platinum', fee: 2000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Ecobank Burkina Faso'], card_type: 'Prépayée', fee: 0, frequency: 'an', notes: 'Variable', created_at: new Date(), updated_at: new Date() },

      // BADF
      { bank_id: bankNameToId['BADF Burkina Faso'], card_type: 'Classique Particulier', fee: 4980, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['BADF Burkina Faso'], card_type: 'Entreprise Individuelle', fee: 12500, frequency: 'an', created_at: new Date(), updated_at: new Date() },

      // WBI
      { bank_id: bankNameToId['WBI (Wendkuni Bank International)'], card_type: 'GIM Particulier', fee: 5000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['WBI (Wendkuni Bank International)'], card_type: 'GIM Pro', fee: 10000, frequency: 'an', created_at: new Date(), updated_at: new Date() },

      // BCB
      { bank_id: bankNameToId['Banque Commerciale du Burkina (BCB)'], card_type: 'Visa Individuel', fee: 9000, frequency: 'an', notes: 'pour 3 ans', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Commerciale du Burkina (BCB)'], card_type: 'Visa Commerçant/Entreprise', fee: 12500, frequency: 'an', created_at: new Date(), updated_at: new Date() },

      // SGBF
      { bank_id: bankNameToId['Société Générale Burkina Faso (SGBF)'], card_type: 'Visa Classic Horizon', fee: 12500, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Société Générale Burkina Faso (SGBF)'], card_type: 'Visa Flamboyant', fee: 39000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Société Générale Burkina Faso (SGBF)'], card_type: 'Visa Premier', fee: 69000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Société Générale Burkina Faso (SGBF)'], card_type: 'Visa Platinum', fee: 150000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Société Générale Burkina Faso (SGBF)'], card_type: 'Visa Infinite', fee: 250000, frequency: 'an', created_at: new Date(), updated_at: new Date() },

      // CBAO
      { bank_id: bankNameToId['CBAO Burkina Faso'], card_type: 'Visa Electron', fee: 17094, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['CBAO Burkina Faso'], card_type: 'Visa Classic', fee: 42735, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['CBAO Burkina Faso'], card_type: 'Visa Gold', fee: 128205, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['CBAO Burkina Faso'], card_type: 'Prépayée Kalpé', fee: 12820, frequency: 'an', created_at: new Date(), updated_at: new Date() },

      // Orabank
      { bank_id: bankNameToId['Orabank Burkina Faso'], card_type: 'VISA Classic', fee: 6000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Orabank Burkina Faso'], card_type: 'Prépayée LIBERTÉ', fee: 500, frequency: 'mois', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Orabank Burkina Faso'], card_type: 'VISA Premier', fee: 18000, frequency: 'an', created_at: new Date(), updated_at: new Date() },

      // UBA
      { bank_id: bankNameToId['UBA Burkina Faso'], card_type: 'Visa Classic', fee: 5000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['UBA Burkina Faso'], card_type: 'Visa Gold', fee: 10000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['UBA Burkina Faso'], card_type: 'Prépayée', fee: 0, frequency: 'an', created_at: new Date(), updated_at: new Date() },

      // Banque Atlantique
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], card_type: 'Visa Classic', fee: 6000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], card_type: 'Visa Gold', fee: 12000, frequency: 'an', created_at: new Date(), updated_at: new Date() },
      { bank_id: bankNameToId['Banque Atlantique Burkina Faso'], card_type: 'Prépayée', fee: 0, frequency: 'an', created_at: new Date(), updated_at: new Date() },
    ];

    await queryInterface.bulkInsert('bank_cards', bankCards, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bank_cards', null, {});
  }
};
