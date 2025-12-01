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
    await queryInterface.createTable('bank_products', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER 
      },
      bank_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'banks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete : 'CASCADE'
      },
      product_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      details: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      fees: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('bank_products');
  }
};
