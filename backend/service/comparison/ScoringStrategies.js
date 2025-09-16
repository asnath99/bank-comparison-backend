'use strict';
/**
 * Stratégies de scoring génériques, réutilisables pour tous critères.
 * - lower_better : plus la valeur est basse, meilleur est le score.
 * - exact_match : 1 si égalité stricte, sinon 0 (utile pour “banque propose X ?”).
 */
class ScoringStrategies {
  static lower_better(values) {
    // values = tableau des valeurs numériques pour toutes les banques (null si pas de données)
    
    const nums = values.map(v => (typeof v === 'number' && isFinite(v) && v >= 0) ? v : null);
    const valid = nums.filter(n => n !== null);
    if (valid.length === 0) {
        return { scores: values.map(() => 0), meta: { allMissing: true, strategy: 'lower_better' } };
    }

    const min = Math.min(...valid);
    const max = Math.max(...valid);
    const range = max - min || 1;

    // normalisation [0..100] (100 = meilleur)
    if (range === 0) {
     return { scores: nums.map(n => n !== null ? 100 : 0), meta: { min, max, allEqual: true, strategy: 'lower_better' } };
    }
   return {
     scores: nums.map(n => n === null ? 0 : Math.round(100 * (max - n) / range)),
     meta: { min, max, range, strategy: 'lower_better' }
   };
  }

  static exact_match(values, target) {
    return {
      scores: values.map(v => (v === target ? 100 : 0)),
      meta: { target }
    };
  }
}

module.exports = ScoringStrategies;
