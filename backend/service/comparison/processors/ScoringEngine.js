'use strict';

const ScoringStrategies = require('../ScoringStrategies');

class ScoringEngine {
  /**
   * Calcule les scores de base selon la stratégie déclarée sur le critère
   */
  calculateBaseScores(criterion, values) {
    const strategy = criterion.scoringStrategy || 'lower_better';

    try {
      if (strategy === 'lower_better') {
        return this.calculateLowerBetterScores(values);
      }

      return this.delegateToScoringStrategy(strategy, criterion, values);

    } catch (error) {
      console.error(`Erreur stratégie ${strategy}:`, error);
      return { 
        scores: values.map(() => 0), 
        meta: { error: error.message, strategy } 
      };
    }
  }

  calculateLowerBetterScores(values) {
    const nums = values.map(v => {
      if (this.isMissingValue(v)) return null;
      const n = Number(v);
      return (Number.isFinite(n) && n >= 0) ? n : null;
    });

    const validValues = nums.filter(n => n !== null);
    
    if (!validValues.length) {
      return { 
        scores: values.map(() => 0), 
        meta: { allMissing: true, strategy: 'lower_better' } 
      };
    }

    const min = Math.min(...validValues);
    const max = Math.max(...validValues);
    const range = max - min;

    if (range === 0) {
      return {
        scores: nums.map(n => (n !== null ? 100 : 0)),
        meta: { min, max, allEqual: true, strategy: 'lower_better' }
      };
    }

    const scores = nums.map(n => 
      n === null ? 0 : Math.round(100 * (max - n) / range)
    );

    return { 
      scores, 
      meta: { min, max, range, strategy: 'lower_better' } 
    };
  }

  delegateToScoringStrategy(strategy, criterion, values) {
    const strategyFn = ScoringStrategies[strategy];
    
    if (typeof strategyFn !== 'function') {
      console.warn(`Stratégie ${strategy} inconnue, fallback vers lower_better`);
      return this.calculateLowerBetterScores(values);
    }

    // Appel  les paramètres appropriés selon la stratégie
    switch (strategy) {
      case 'exact_match':
        return strategyFn.call(ScoringStrategies, values, criterion.targetValue);
      default:
        return strategyFn.call(ScoringStrategies, values);
    }
  }

  isMissingValue(value) {
    return value === null || value === undefined || value === '';
  }
}

module.exports = ScoringEngine;