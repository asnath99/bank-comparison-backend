'use strict';
//Rôle : Coordonne les différents services intervenant dans la comparaison
const CriteriaRegistry = require('./CriteriaRegistry');
const RuleManager = require('./RuleManager');
const DataAggregator = require('./DataAggregator');
const PlainModeProcessor = require('./processors/PlainModeProcessor');
const ScoreModeProcessor = require('./processors/ScoreModeProcessor');
const FactsBuilder = require('./FactsBuilder');

class ComparisonEngine {
  constructor() {
    this.criteriaRegistry = new CriteriaRegistry();
    this.ruleManager = new RuleManager();
    this.dataAggregator = new DataAggregator();
    this.factsBuilder = new FactsBuilder();
    this.processors = {
      plain: new PlainModeProcessor(),
      score: new ScoreModeProcessor()
    };
  }

  /**
   * Compare des banques selon une liste de critères.
   */
  async compare({ criteriaKeys = [], bankIds = [], mode = 'score', filters = {}, budgets = null }) {

    criteriaKeys = Array.isArray(criteriaKeys) ? criteriaKeys.filter(Boolean) : [];
    bankIds = Array.isArray(bankIds) ? bankIds.filter(Boolean) : [];

    try {
       if (!this.processors[mode]) {
       return this.buildErrorResponse(mode, `Mode inconnu: ${mode}. Modes supportés: ${Object.keys(this.processors).join(', ')}`);
     }
     
      // Validation des critères actifs
      const criteria = await this.criteriaRegistry.getActiveCriteria(criteriaKeys);
      if (!criteria.length) {
        return this.buildErrorResponse(mode, 'Aucun critère actif trouvé.');
      }

      // Chargement des règles par critère
      const rulesByCriteria = await this.ruleManager.getRulesForCriteriaAndMode(
        criteria.map(c => c.key), mode
      );

      // Collecte des données bancaires
    const processed = await this.dataAggregator.collect(bankIds, criteria, filters);
    const { banks, valuesByCriteria, pickedIdsByCriteria } = processed;
      if (!banks.length) {
        return this.buildErrorResponse(mode, 'Aucune banque trouvée.', criteria);
      }

      // Délégation vers le processeur approprié
      const processor = this.processors[mode];

      const t0 = Date.now(); //debut du timing de comparaison 
      const result = await processor.process({
        criteria,
        banks,
        valuesByCriteria,
        pickedIdsByCriteria,
        rulesByCriteria,
        factsBuilder: this.factsBuilder,
        budgets
      });
     
     const meta = { elapsed_ms: Date.now() - t0, criteria_count: criteria.length, bank_count: banks.length, mode };//calcul du timing
     return { ...result, success: true, meta };

    } catch (error) {
      console.error('Erreur dans ComparisonEngine.compare:', error);
      const safeMsg = 'Une erreur interne est survenue.';
      return this.buildErrorResponse(mode, safeMsg);
    }
  }

  buildErrorResponse(mode, message, criteria = []) {
    return {
      mode,
      success: false,
      error: message,
      criteria_used: criteria.map(c => ({ key: c.key, label: c.label }))
    };
  }
}

module.exports = ComparisonEngine;