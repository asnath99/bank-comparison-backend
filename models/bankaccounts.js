'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BankAccount extends Model {
    static associate(models) {
    // Associations avec les autres modèles
      BankAccount.belongsTo(models.Bank, {foreignKey: 'bank_id'});
    }
  }

  BankAccount.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    bank_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'banks',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    monthly_fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
     monthly_fee_is_ttc: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    },
    has_variable_fees: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    variable_fee_rules: {
      type: DataTypes.JSON,
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'F CFA'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending'
    }

  }, {
    sequelize,
    modelName: 'BankAccount',
    tableName: 'bank_accounts',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return BankAccount;
};