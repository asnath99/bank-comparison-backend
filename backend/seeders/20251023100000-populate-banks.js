'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('banks', [
      { name: 'BOA (Banque of Africa)', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'BSIC (Banque Sahélo-Saharienne)', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Ecobank Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'BADF Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'WBI (Wendkuni Bank International)', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Vista Bank Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Banque Commerciale du Burkina (BCB)', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Société Générale Burkina Faso (SGBF)', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'CBAO Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Orabank Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'UBA Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Banque Atlantique Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'IB Bank Burkina Faso', is_active: true, created_at: new Date(), updated_at: new Date() },
      { name: 'Coris Bank International', is_active: true, created_at: new Date(), updated_at: new Date() },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('banks', null, {});
  }
};
