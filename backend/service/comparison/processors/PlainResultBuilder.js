'use strict';
/**
 * Met en forme les résultats pour l'affichage de la comparaison en mode plain
 */
class PlainResultBuilder {
  buildResults({ criteria, banks, perCriteria, pickedIdsByCriteria, budgets = null }) {
    const perCriterionResults = this.buildPerCriterionResults(banks, perCriteria, pickedIdsByCriteria);
    const showOverall = Array.isArray(criteria) && criteria.length > 1;

    const plainResult = {
      mode: 'plain',
      criteria_used: criteria,
      per_criterion: perCriterionResults
    };

    if (showOverall) {
      plainResult.overall_ranking = this.calculateOverallResults(banks, perCriteria, criteria, pickedIdsByCriteria);
    }

    //Ajouter l'analyse budgets si présente
    if (budgets) {
      plainResult.budget_analysis = this.buildBudgetAnalysis(banks, perCriteria, budgets);
    }

    return plainResult;
  }

  //Construction du classement global
  calculateOverallResults(banks, perCriteria, metaByCriteria, pickedIdsByCriteria) {
    const totals = banks.map(() => ({ 
      sortSum: 0, 
      excluded: false
    }));

    // Agrégation des clés de tri
    perCriteria.forEach((pc, idx) => {
      const critMeta = metaByCriteria[idx];
      pc.bankResults.forEach((br, i) => {
        const w = (critMeta.weight || 1);
        totals[i].sortSum += (br.sortKey * w);
        
        if (critMeta.critical && br.excluded) {
          totals[i].excluded = true;
        }
      });
    });

    // Construction et tri des résultats
    const overall = banks.map((bank, i) => {
      const values = {};
      const notes = {};
      const productIds = {}; 
      
      perCriteria.forEach(pc => {
        const br = pc.bankResults[i];
        values[pc.criteria.key] = br.display;
        if (br.notes?.length) notes[pc.criteria.key] = br.notes;
        
        
        const criterionKey = pc.criteria.key;
        const pickedIds = pickedIdsByCriteria[criterionKey];
        if (pickedIds && pickedIds[i] !== null) {
          productIds[criterionKey] = pickedIds[i];
        }
      });

      return {
        bank: { id: bank.id, name: bank.name },
        values,
        notes,
        productIds, 
        excluded: totals[i].excluded,
        _sortScore: totals[i].sortSum
      };
    });

    overall.sort((a, b) => {
      if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;
      if (a._sortScore !== b._sortScore) return a._sortScore - b._sortScore;
      return a.bank.id - b.bank.id;
    });

    return overall.map(({ _sortScore, ...rest }) => rest);
  }

  //Construction du classement par critère
  buildPerCriterionResults(banks, perCriteria, pickedIdsByCriteria) {
    return perCriteria.map(pc => {
      const criterionKey = pc.criteria.key;
      const pickedIds = pickedIdsByCriteria[criterionKey] || [];
      
      const rows = banks.map((bank, i) => {
        const br = pc.bankResults[i];
        const result = {
          bank: { id: bank.id, name: bank.name },
          value: br.numValue,
          display: br.display,
          available: br.numValue !== null,
          notes: br.notes || [],
          excluded: br.excluded
        };

        // NOUVEAU : Ajouter l'ID du produit si disponible
        if (pickedIds[i] !== null && pickedIds[i] !== undefined) {
          result.productId = pickedIds[i];
        }

        return result;
      });

      rows.sort((a, b) => {
        if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;
        if (a.available !== b.available) return a.available ? -1 : 1;
        if (!a.available && !b.available) return 0;
        return (a.value || 0) - (b.value || 0);
      });

      return { criteria: pc.criteria, ranking: rows };
    });
  }

  buildBudgetAnalysis(banks, perCriteria, budgets) {
    const within_budget = [];
    const over_budget = [];
    const missing_data = [];

    banks.forEach((bank, bankIndex) => {
      const bankObj = { id: bank.id, name: bank.name };
      let hasExceeded = false;
      let hasMissing = false;
      const exceeded_criteria = [];
      const missing_criteria = [];

      // Parcourir chaque critère budgété
      for (const [criterionKey, budgetMax] of Object.entries(budgets)) {
        // Trouver le critère dans perCriteria
        const criteriaData = perCriteria.find(pc => pc.criteria.key === criterionKey);
        if (!criteriaData) continue;

        const bankResult = criteriaData.bankResults[bankIndex];
        const value = bankResult ? bankResult.numValue : null;

        if (value === null || value === undefined) {
          hasMissing = true;
          missing_criteria.push(criterionKey);
        } else if (value > budgetMax) {
          hasExceeded = true;
          exceeded_criteria.push({
            criterion: criterionKey,
            budget: budgetMax,
            actual: value,
            excess: value - budgetMax
          });
        }
      }

      // Classification
      if (hasMissing) {
        missing_data.push({ bank: bankObj, missing_criteria });
      } else if (hasExceeded) {
        over_budget.push({ bank: bankObj, exceeded_criteria });
      } else {
        within_budget.push({ bank: bankObj, status: "Respecte tous les budgets" });
      }
    });

    return { within_budget, over_budget, missing_data };
  }
}

module.exports = PlainResultBuilder;