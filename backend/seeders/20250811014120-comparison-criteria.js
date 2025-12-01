'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('comparison_criteria', [
      {
        key: 'account_monthly_fee',
        label: 'Frais mensuels de tenue de compte',
        description: 'Montant mensuel débité pour la tenue de compte.',
        // Récupère la donnée à partir du modèle et du chemin de l’attribut
        data_mapping: JSON.stringify({ model: 'BankAccount', path: 'monthly_fee' }),
        scoring_strategy: 'lower_better',
        is_active: true,
        created_at: new Date(), updated_at: new Date()
      },
      {
        key: 'card_annual_fee',
        label: 'Frais annuels de carte',
        description: 'Frais annuels de la carte bancaire.',
        data_mapping: JSON.stringify({ model: 'BankCard', path: 'fee' }),
        scoring_strategy: 'lower_better',
        is_active: true,
        created_at: new Date(), updated_at: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('comparison_criteria', null, {});
  }
};
