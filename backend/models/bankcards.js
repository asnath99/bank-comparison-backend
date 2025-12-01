'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BankCard extends Model {
    static associate(models) {
    // Associations avec les autres modèles
      BankCard.belongsTo(models.Bank, {foreignKey: 'bank_id'});
    }
  }

  BankCard.init({
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
    card_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    fee: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    fee_is_ttc: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    },
    frequency: {
      type: DataTypes.ENUM('an', 'mois'),
      allowNull: false,
      defaultValue: 'an',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'BankCard',
    tableName: 'bank_cards',
    underscored: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return BankCard;
};