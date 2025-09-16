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
    await queryInterface.removeColumn('bank_products', 'details');

    await queryInterface.addColumn('bank_products', 'details', {
      type: Sequelize.JSONB,
      allowNull: false,
      defaultValue: {} // pour éviter les erreurs au moment de l'insertion
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
   await queryInterface.removeColumn('bank_products', 'details');

    await queryInterface.addColumn('bank_products', 'details', {
      type: Sequelize.TEXT,
      allowNull: false,
      defaultValue: {}
    });
  }
};
