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
    await queryInterface.bulkInsert('comparison_rules', [
      {
        criteria_key: 'account_monthly_fee',
        rule_definition: JSON.stringify({
          engine: 'json-rules-engine',
          meta: { explanation_template: 'Frais mensuels les plus bas = meilleure position.' }
        }),
        priority: 1,
        is_active: true,
        created_at: new Date(), updated_at: new Date()
      },
      {
        criteria_key: 'card_annual_fee',
        rule_definition: JSON.stringify({
          engine: 'json-rules-engine',
          meta: { explanation_template: 'Frais annuels de carte les plus bas = meilleure position.' }
        }),
        priority: 1,
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
  }
};
