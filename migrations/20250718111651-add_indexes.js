'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    
    // Index pour bank_accounts
    await queryInterface.addIndex('bank_accounts', ['bank_id'], {
      name: 'idx_bank_accounts_bank_id'
    });
    
    // Index pour bank_cards
    await queryInterface.addIndex('bank_cards', ['bank_id'], {
      name: 'idx_bank_cards_bank_id'
    });
    
    // Index pour bank_products
    await queryInterface.addIndex('bank_products', ['bank_id'], {
      name: 'idx_bank_products_bank_id'
    });
    
    // Index pour admin_logs
    await queryInterface.addIndex('admin_logs', ['admin_id'], {
      name: 'idx_admin_logs_admin_id'
    });
    
    await queryInterface.addIndex('admin_logs', ['timestamp'], {
      name: 'idx_admin_logs_timestamp'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeIndex('bank_accounts', 'idx_bank_accounts_bank_id');
    await queryInterface.removeIndex('bank_cards', 'idx_bank_cards_bank_id');
    await queryInterface.removeIndex('bank_products', 'idx_bank_products_bank_id');
    await queryInterface.removeIndex('admin_logs', 'idx_admin_logs_admin_id');
    await queryInterface.removeIndex('admin_logs', 'idx_admin_logs_timestamp');
  }
};
