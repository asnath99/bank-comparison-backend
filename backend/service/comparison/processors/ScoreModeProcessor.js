'use strict';
/**
 * Coordonne le calcul du mode score
 */
const { ruleExecutor } = require('../RuleExecutor');
const ScoringEngine = require('./ScoringEngine');
const ScoreResultBuilder = require('./ScoreResultBuilder');

class ScoreModeProcessor {
  constructor() {
    this.scoringEngine = new ScoringEngine();
    this.resultBuilder = new ScoreResultBuilder();
  }

  async process({ criteria, banks, valuesByCriteria, pickedIdsByCriteria, rulesByCriteria, factsBuilder, budgets = null }) {
    const perCriteria = [];
    const weights = [];
    const criticalFlags = [];

    // Traitement par critère
    for (const criterion of criteria) {
      try {
        const values = valuesByCriteria[criterion.key] || banks.map(() => null);
        const rules = rulesByCriteria.get(criterion.key) || [];

        // Calcul des scores de base
        const { scores: baseScores, meta } = this.scoringEngine.calculateBaseScores(
          criterion, values
        );

        // Application des règles avec scores de base
        const adjustedResults = await this.processCriterion(
          criterion, banks, values, rules, baseScores, meta, factsBuilder);

        const { weight, critical } = this.extractMetaFromRules(rules);
        weights.push(weight);
        criticalFlags.push(critical);

        // Construction des détails explicatifs
        const explanationBlock = this.resultBuilder.buildPerCriteriaExplanation(
          criterion, banks, values, adjustedResults.scores, meta
        );

        perCriteria.push({
          criteria: { key: criterion.key, label: criterion.label },
          scores: adjustedResults.scores,
          excluded: adjustedResults.excluded,
          notesByBank: adjustedResults.notesByBank,
          details: { explanation: explanationBlock }
        });

      } catch (error) {
        console.error(`Erreur critère ${criterion.key} (score):`, error);
        
        perCriteria.push(this.createErrorCriteriaResult(criterion, banks, error));
        weights.push(1);
        criticalFlags.push(false);
      }
    }

    // Construction des résultats finaux
    return this.resultBuilder.buildResults({
      criteria,
      banks,
      perCriteria,
      weights,
      criticalFlags,
      budgets,
      valuesByCriteria,
      pickedIdsByCriteria   
    });
  }

  async processCriterion(criterion, banks, values, rules, baseScores, baseMeta, factsBuilder) {
    const scores = [];
    const excluded = [];
    const notesByBank = [];

    for (let i = 0; i < banks.length; i++) {
      const facts = factsBuilder.buildFactsForBank(values[i], banks[i], criterion.key, 'score');
      facts.raw_score = baseScores[i] || 0;
      facts.stats = baseMeta || null; 

      const { score, excluded: isExcluded, notes } = 
      await ruleExecutor.executeRulesForBank(`${criterion.key}_score`, rules, facts, baseScores[i] || 0);

      scores.push(Math.max(0, Math.min(100, Number(score) || 0)));
      excluded.push(Boolean(isExcluded));
      notesByBank.push(Array.isArray(notes) ? notes : (notes ? [notes] : []));
    }

    return { scores, excluded, notesByBank };
  }

  extractMetaFromRules(rules) {
    const weightRule = rules.find(r => r.definition?.meta?.weight != null);
    const weight = weightRule ? Number(weightRule.definition.meta.weight) : 1;
    const critical = rules.some(r => r.definition?.meta?.critical === true);
    
    return { 
      weight: Number.isFinite(weight) ? weight : 1, 
      critical 
    };
  }

  createErrorCriteriaResult(criterion, banks, error) {
    return {
      criteria: { key: criterion.key, label: criterion.label },
      scores: banks.map(() => 0),
      excluded: banks.map(() => false),
      notesByBank: banks.map(() => [`Erreur de calcul: ${error.message}`]),
      details: { 
        explanation: `Erreur lors du calcul de ce critère: ${error.message}` 
      }
    };
  }
}

module.exports = ScoreModeProcessor;