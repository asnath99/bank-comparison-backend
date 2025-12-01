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

    //bank_cards
    await queryInterface.renameColumn('bank_cards', 'createdAt', 'created_at');
    await queryInterface.renameColumn('bank_cards', 'updatedAt', 'updated_at');

    //bank_products
    await queryInterface.renameColumn('bank_products', 'createdAt', 'created_at');
    await queryInterface.renameColumn('bank_products', 'updatedAt', 'updated_at');

    //admin_users
    await queryInterface.renameColumn('admin_users', 'createdAt', 'created_at');
    await queryInterface.renameColumn('admin_users', 'updatedAt', 'updated_at');

    //admin-logs
    await queryInterface.renameColumn('admin_logs', 'createdAt', 'created_at');
    await queryInterface.renameColumn('admin_logs', 'updatedAt', 'updated_at');
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        
    //bank_cards
    await queryInterface.renameColumn('bank_cards', 'created_at', 'createdAt');
    await queryInterface.renameColumn('bank_cards', 'updated_at', 'updatedAt');
    
    //bank_products
    await queryInterface.renameColumn('bank_products', 'created_at', 'createdAt');
    await queryInterface.renameColumn('bank_products', 'updated_at', 'updatedAt');
    
    //admin_users
    await queryInterface.renameColumn('admin_users', 'created_at', 'createdAt');
    await queryInterface.renameColumn('admin_users', 'updated_at', 'updatedAt');
    
    //admin_logs
    await queryInterface.renameColumn('admin_logs', 'created_at', 'createdAt');
    await queryInterface.renameColumn('admin_logs', 'updated_at', 'updatedAt');
 
  }
};
