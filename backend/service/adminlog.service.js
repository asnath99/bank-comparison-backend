// services/admin/AdminLogService.js
const { AdminLog, AdminUser, Sequelize } = require('../models');
const BaseService = require('./BaseService');
const { Op } = Sequelize;
const { ValidationError } = require('../utils/errors');

class AdminLogService extends BaseService {
  constructor() {
    super(AdminLog, 'Log admin');
  }

  /**
   * Enregistrer une action admin
   */
  async logAction(admin_id, action, details) {
    if (!admin_id) throw new ValidationError('L\'ID de l\'admin est requis');
    if (!action) throw new ValidationError('L\'action est requise');
    await this.validateRelatedEntity(AdminUser, admin_id, 'Utilisateur admin');
    return await this.create({
      admin_id,
      action,
      details: details ? JSON.stringify(details) : null,
      timestamp: new Date()
    });
  }

  /**
   * Lister les logs
   */
  async getLogs({ admin_id, startDate, endDate, limit = 100 }) {
    const where = {};
    if (admin_id) {
      await this.validateRelatedEntity(AdminUser, admin_id, 'Utilisateur admin');
      where.admin_id = admin_id;
    }
    if (startDate && endDate) {
      where.timestamp = { [Op.between]: [new Date(startDate), new Date(endDate)] };
    }
    return await this.getAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: Math.min(limit, 1000)
    });
  }
}

module.exports = new AdminLogService();