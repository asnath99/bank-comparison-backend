const { ComparisonCriteria } = require('../models');
const BaseService = require('./BaseService');

class ComparisonCriteriaService extends BaseService {
  constructor() {
    super(ComparisonCriteria, 'Critère de comparaison');
  }

  /**
   * Lister tous les critères de comparaison actifs pour le public
   */
  async getActiveCriteria() {
    return await this.getAll({
      where: { is_active: true },
      order: [['label', 'ASC']]
    });
  }

    /**
   * Lister tous les critères de comparaison pour l'admin
   */
  async getAllCriteriaForAdmin() {
    return await this.getAll({ order: [['label', 'ASC']] });
  }
}

module.exports = new ComparisonCriteriaService();
