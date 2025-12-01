'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BankProduct extends Model {
    static associate(models) {
    // Associations avec les autres modèles
      BankProduct.belongsTo(models.Bank, {foreignKey: 'bank_id'});
    }
  }

  BankProduct.init({
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
    product_type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    details: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: {} // pour permettre de créer un type de produits sans détails

    },
    fees: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    status: {   
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'inactive'
    }

  }, {
    sequelize,
    modelName: 'BankProduct',
    tableName: 'bank_products',
    underscored: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return BankProduct;
};