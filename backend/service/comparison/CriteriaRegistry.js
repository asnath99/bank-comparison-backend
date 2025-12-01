'use strict';
/**
 * Charge les critères depuis la base.
 * Chaque critère décrit comment lire la donnée côté ORM (model + path),
 * et la stratégie de scoring à utiliser.
 */
const { ComparisonCriteria } = require('../../models');

class CriteriaRegistry {

  async getActiveCriteria(keys = []) {

    const where = { is_active: true };
    if (Array.isArray(keys) && keys.length) where.key = keys;
    const rows = await ComparisonCriteria.findAll({ where, order: [['key', 'ASC']] });

    // Normalise pour usage interne
    return rows.map(r => ({
      key: r.key,
      label: r.label,
      description: r.description,
      dataMapping: r.data_mapping,      
      scoringStrategy: r.scoring_strategy,  
    }));
  }
}

module.exports = CriteriaRegistry;
