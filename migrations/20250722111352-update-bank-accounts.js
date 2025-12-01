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
    await queryInterface.addColumn('bank_accounts', 'monthly_fee_is_ttc', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });

    await queryInterface.addColumn('bank_accounts', 'has_variable_fees', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.addColumn('bank_accounts', 'variable_fee_rules', {
      type: Sequelize.JSON,
    });

    await queryInterface.changeColumn('bank_accounts', 'currency', {
      type: Sequelize.STRING(10),
      defaultValue: 'F CFA',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
        await queryInterface.removeColumn('bank_accounts', 'monthly_fee_is_ttc');
    await queryInterface.removeColumn('bank_accounts', 'has_variable_fees');
    await queryInterface.removeColumn('bank_accounts', 'variable_fee_rules');

    // Optionnel : remettre l'ancienne valeur par défaut
    await queryInterface.changeColumn('bank_accounts', 'currency', {
      type: Sequelize.STRING(10),
      defaultValue: 'XOF',
    });
  }
};
