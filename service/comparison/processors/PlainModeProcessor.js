'use strict';
/**
 * Produit un classement basé sur les données sans calcul.
 */
const { ruleExecutor } = require('../RuleExecutor');
const PlainResultBuilder = require('./PlainResultBuilder');

class PlainModeProcessor {
  constructor() {
    this.resultBuilder = new PlainResultBuilder();
  }

  async process({ criteria, banks, valuesByCriteria, pickedIdsByCriteria, rulesByCriteria, factsBuilder, budgets = null }) {
    const perCriteria = [];
    const metaByCriteria = [];

    // Traitement par critère
    for (const criterion of criteria) {
      try {
        const values = valuesByCriteria[criterion.key] || banks.map(() => null);
        const rules = rulesByCriteria.get(criterion.key) || [];

        const bankResults = await this.processCriterion(
          criterion, banks, values, rules, factsBuilder
        );

        const { weight, critical } = this.extractMetaFromRules(rules);

        perCriteria.push({ 
          criteria: { key: criterion.key, label: criterion.label }, 
          bankResults 
        });
        
        metaByCriteria.push({ 
          key: criterion.key, 
          label: criterion.label, 
          weight, 
          critical 
        });

      } catch (error) {
        console.error(`Erreur critère ${criterion.key} (plain):`, error);
        
        const errorResults = this.createErrorResults(banks, error);
        perCriteria.push({ 
          criteria: { key: criterion.key, label: criterion.label }, 
          bankResults: errorResults 
        });
        
        metaByCriteria.push({ 
          key: criterion.key, 
          label: criterion.label, 
          weight: 1, 
          critical: false 
        });
      }
    }

    // Construction des résultats finaux
    return this.resultBuilder.buildResults({
      criteria: metaByCriteria,
      banks,
      pickedIdsByCriteria,
      perCriteria,
      budgets
    });
  }

  async processCriterion(criterion, banks, values, rules, factsBuilder) {
    const bankResults = [];

    for (let i = 0; i < banks.length; i++) {
      const rawValue = values[i];

      // Standardise la valeur en facts
      const facts = factsBuilder.buildFactsForBank(
        rawValue, banks[i], criterion.key, 'plain', i
      );
      // Exécute les règles pour ce critère
      const { excluded, notes, display, sortKey } = 
        await ruleExecutor.executeRulesForBank(`${criterion.key}_plain`, rules, facts);
        
      //Construit la ligne de résultat pour cette banque
      bankResults.push({
        bankIndex: i,
        rawValue,
        numValue: facts.numeric_value,
        excluded: Boolean(excluded),
        notes: Array.isArray(notes) ? notes : (notes ? [notes] : []),
        display: this.getDisplayValue(display, facts.numeric_value),
        sortKey: this.getSortKey(sortKey, facts.numeric_value)
      });
    }

    return bankResults;
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

  createErrorResults(banks, error) {
    return banks.map((bank, i) => ({
      bankIndex: i,
      rawValue: null,
      numValue: null,
      excluded: false,
      notes: [`Erreur: ${error.message}`],
      display: 'Erreur de calcul',
      sortKey: 1e12 
    }));
  }

  //Formate l'affichage
  getDisplayValue(ruleDisplay, numericValue) {
    if (ruleDisplay !== undefined) return ruleDisplay;
    if (numericValue === null) return 'Non communiqué';
    if (numericValue === 0) return 'Gratuit (0)';
    return String(numericValue);
  }

  getSortKey(ruleSortKey, numericValue) {
    if (ruleSortKey !== undefined) return ruleSortKey;
    const BIG = 1e12;
    return numericValue !== null ? numericValue : BIG;
  }
}

module.exports = PlainModeProcessor;