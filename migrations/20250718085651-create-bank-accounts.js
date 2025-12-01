'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.createTable('bank_accounts', {
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
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      monthly_fee: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: true
      },
      currency: {
        type: Sequelize.STRING(10),
        defaultValue: 'XOF'
      },
      minimum_balance: {        
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      interest_rate: {          
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {                 
        type: Sequelize.STRING(20),
        allowNull: false,
        defaultValue: 'pending'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
        await queryInterface.dropTable('bank_accounts');
  }
};

