// models/ComparisonCriteria.js
'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ComparisonCriteria = sequelize.define('ComparisonCriteria', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    data_mapping: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    scoring_strategy: {
      type: DataTypes.STRING,
      allowNull: false, 
      defaultValue: 'lower_better'
    },
    is_active: {
      type: DataTypes.BOOLEAN, 
      allowNull: false,
      defaultValue: true,
    }
  }, {
    sequelize,
    modelName: 'ComparisonCriteria',
    tableName: 'comparison_criteria',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ComparisonCriteria;
};