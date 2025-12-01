'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('comparison_rules', 'name', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'Default Rule Name'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('comparison_rules', 'name');
  }
};
