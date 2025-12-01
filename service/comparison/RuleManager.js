'use strict';
/**
 * Charge toutes les règles actives associées à un ou plusieurs critères et au mode choisi
 */
const { ComparisonRule } = require('../../models');

class RuleManager {

  async getRulesForCriteriaAndMode(criteriaKeys = [], mode = 'score') {
    const rows = await ComparisonRule.findAll({
      where: { is_active: true, criteria_key: criteriaKeys },
      order: [['priority', 'DESC'], ['id', 'DESC']]
    });

    const map = new Map();
    for (const r of rows) {
      const def = r.rule_definition;
      const modes = def?.meta?.modes; 
      const usable = !Array.isArray(modes) || modes.includes(mode);
      if (!usable) continue;

      const item = {
        id: r.id,
        criteria_key: r.criteria_key,
        definition: def,
        priority: r.priority,
        is_active: r.is_active
      };
      if (!map.has(r.criteria_key)) map.set(r.criteria_key, []);
      map.get(r.criteria_key).push(item);
    }
    return map;
  }
}

module.exports = RuleManager;
