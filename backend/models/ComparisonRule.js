// models/ComparisonRule.js
'use strict';
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ComparisonRule = sequelize.define('ComparisonRule', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    criteria_key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rule_definition: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false, 
      defaultValue: 1 
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'ComparisonRule',
    tableName: 'comparison_rules',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return ComparisonRule;
};