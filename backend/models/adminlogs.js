'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AdminLog extends Model {
    static associate(models) {
    // Associations avec les autres modèles
      AdminLog.belongsTo(models.AdminUser, {foreignKey: 'admin_id'});
    }
  }

  AdminLog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'admin_users',
        key: 'id'
      }
    },
    action: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'AdminLog',
    tableName: 'admin_logs',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return AdminLog;
};