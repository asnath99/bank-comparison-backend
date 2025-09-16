'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    static associate(models) {
      // Associations avec les autres modèles
      Bank.hasMany(models.BankAccount, { foreignKey: 'bank_id' });
      Bank.hasMany(models.BankCard, { foreignKey: 'bank_id' });
      Bank.hasMany(models.BankProduct, { foreignKey: 'bank_id' });
    }
  }

  Bank.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    logo_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Bank',
    tableName: 'banks',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Bank;
};