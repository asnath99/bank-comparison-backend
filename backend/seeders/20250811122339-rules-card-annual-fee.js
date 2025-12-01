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
    const now = new Date();

    // 1) Meta: poids=2 + critère critique
    await queryInterface.bulkInsert('comparison_rules', [{
      criteria_key: 'card_annual_fee',
      rule_definition: JSON.stringify({
        engine: 'json-rules-engine',
        meta: { weight: 2, critical: true }
      }),
      priority: 200,
      is_active: true,
      created_at: now,
      updated_at: now
    }]);

    // 2) Exclure si donnée manquante
    await queryInterface.bulkInsert('comparison_rules', [{
      criteria_key: 'card_annual_fee',
      rule_definition: JSON.stringify({
        conditions: { all: [ { fact: 'missing', operator: 'equal', value: true } ] },
        event: { type: 'exclude', params: { explanation: 'Frais carte manquant : exclu' } }
      }),
      priority: 100,
      is_active: true,
      created_at: now,
      updated_at: now
    }]);

    // 3) Bonus si frais < 1500 : +10
    await queryInterface.bulkInsert('comparison_rules', [{
      criteria_key: 'card_annual_fee',
      rule_definition: JSON.stringify({
        conditions: { all: [ { fact: 'value', operator: 'lessThan', value: 1500 } ] },
        event: { type: 'bonus', params: { add: 10, explanation: 'Frais < 1500 : +10' } }
      }),
      priority: 90,
      is_active: true,
      created_at: now,
      updated_at: now
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('comparison_rules', { criteria_key: 'card_annual_fee' });

  }
};
