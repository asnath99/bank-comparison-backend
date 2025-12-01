'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('bank_accounts', 'status', {
  type: Sequelize.STRING(20),
  allowNull: false,
  defaultValue: 'pending'
});

await queryInterface.addColumn('bank_accounts', 'minimum_balance', {
  type: Sequelize.DECIMAL(10,2),
  allowNull: true
});

await queryInterface.addColumn('bank_accounts', 'interest_rate', {
  type: Sequelize.DECIMAL(5,2),
  allowNull: true
});

  },

  async down (queryInterface, Sequelize) {
    
  }
};
