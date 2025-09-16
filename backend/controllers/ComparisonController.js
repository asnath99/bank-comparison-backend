'use strict';
const ComparisonEngine = require('../service/comparison/ComparisonEngine');
const { handleError } = require('../utils/errorHandler');

class ComparisonController {
static async compare(req, res, next) {
  try {
    const { criteria = [], bankIds = [], mode = 'score', filters = {}, budgets = {} } = req.body || {};
    
    // Validation critères
    if (!Array.isArray(criteria) || !criteria.length) {
      return res.status(400).json({ error: 'Veuillez fournir des valeurs pour "criteria".' });
    }

    // Validation budgets
    if (budgets && typeof budgets === 'object') {
      for (const [key, value] of Object.entries(budgets)) {
        if (!criteria.includes(key)) {
          return res.status(400).json({
            error: `Budget fourni pour un critère non demandé: ${key}`
          });
        }
        if (typeof value !== 'number' || value < 0) {
          return res.status(400).json({
            error: `Budget invalide pour ${key}: doit être un nombre >= 0`
          });
        }
      }
    }

    const engine = new ComparisonEngine();
    const result = await engine.compare({ 
      criteriaKeys: criteria, 
      bankIds, 
      mode, 
      filters,
      budgets: Object.keys(budgets).length > 0 ? budgets : null
    });

    return res.json(result);
  } catch (error) {
    handleError(res, error);
  }
}
}

module.exports = ComparisonController;
