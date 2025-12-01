'use strict';

class ScoreResultBuilder {
//Assemble le résultat final pour le mode score
  buildResults({ criteria, banks, perCriteria, weights, criticalFlags, budgets = null, valuesByCriteria = {}, pickedIdsByCriteria = {} }) {

    //Pour chaque banque fait la moyenne pondérée de ses scores sur les critères où elle n'est pas exclue.
    const totalScores = banks.map((_, i) => {
      let numerator = 0, denominator = 0;
      
      perCriteria.forEach((pc, idx) => {
        if (!pc.excluded?.[i]) {
          numerator += (pc.scores[i] || 0) * weights[idx];
          denominator += weights[idx];
        }
      });
      
      return denominator ? Math.round(numerator / denominator) : 0;
    });

    // Détection des exclusions globales
    const excludedGlobally = banks.map((_, i) =>
      perCriteria.some((pc, idx) => criticalFlags[idx] && pc.excluded?.[i])
    );
    // Métadonnées des critères utilisés
    const criteria_used = criteria.map((c, idx) => ({
      key: c.key,
      label: c.label,
      weight: weights[idx],
      critical: criticalFlags[idx]
    }));

    // Construction du ranking
    const ranking = this.buildRanking(banks, perCriteria, totalScores, excludedGlobally, pickedIdsByCriteria);

    // Compilation des explications
    const explanations = perCriteria
      .map(pc => pc.details?.explanation)
      .filter(Boolean)
      .join('\n\n');

    const result = {
      mode: 'score',
      criteria_used,
      ranking,
      explanations
    };

    // Analyse budgets si présente  
    if (budgets) {
      result.budget_analysis = this.buildBudgetAnalysis({ banks, criteria, valuesByCriteria, budgets });
    }
    return result;
  }

  // formate la liste des banques avec détails
  buildRanking(banks, perCriteria, totalScores, excludedGlobally, pickedIdsByCriteria = {}) {
    return banks
      .map((bank, i) => ({
        bank: { id: bank.id, name: bank.name },
        score: excludedGlobally[i] ? 0 : totalScores[i],
        perCriteria: perCriteria.map(pc => {
          const criterionKey = pc.criteria.key;
          const pickedIds = pickedIdsByCriteria[criterionKey];
          
          const criteriaResult = {
            key: pc.criteria.key,
            score: Math.round(pc.scores[i] || 0),
            notes: pc.notesByBank[i] || []
          };

          // Ajouter l'ID du produit si disponible
          if (pickedIds && pickedIds[i] !== null && pickedIds[i] !== undefined) {
            criteriaResult.productId = pickedIds[i];
          }

          return criteriaResult;
        }),
        // IDs consolidés des produits utilisés
        productIds: this.buildProductIds(perCriteria, pickedIdsByCriteria, i),
        excluded: excludedGlobally[i]
      }))
      .sort((a, b) => {
        if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;
        if (b.score !== a.score) return b.score - a.score;
        
        const scoreA = a.perCriteria[0]?.score ?? 0;
        const scoreB = b.perCriteria[0]?.score ?? 0;
        if (scoreB !== scoreA) return scoreB - scoreA;
        
        return a.bank.id - b.bank.id;
      });
  }

  // Helper pour construire les IDs consolidés
  buildProductIds(perCriteria, pickedIdsByCriteria, bankIndex) {
    const productIds = {};
    
    perCriteria.forEach(pc => {
      const criterionKey = pc.criteria.key;
      const pickedIds = pickedIdsByCriteria[criterionKey];
      
      if (pickedIds && pickedIds[bankIndex] !== null && pickedIds[bankIndex] !== undefined) {
        productIds[criterionKey] = pickedIds[bankIndex];
      }
    });
    
    return productIds;
  }

  buildPerCriteriaExplanation(criterion, banks, values, scores, meta = {}) {
    const lines = [];
    lines.push(`Critère « ${criterion.label} » — ${criterion.description || ''}`.trim());

    if (meta && (meta.min !== undefined) && (meta.max !== undefined)) {
      lines.push(`Min observé: ${meta.min} — Max observé: ${meta.max}`);
    }

    // Détail par banque
    banks.forEach((b, i) => {
      const v = values?.[i];
      const s = scores?.[i];
      const display =
        v === null || v === undefined || v === '' ? 'non communiqué'
        : Number(v) === 0 ? 'gratuit (0)'
        : `${v}`;

      const scoreStr = (typeof s === 'number')
        ? ` (score ${Math.round(s)}/100)`
        : '';

      lines.push(`• ${b.name}: ${display}${scoreStr}`);
    });

    return lines.join('\n');
  }

  buildBudgetAnalysis({ banks, criteria, valuesByCriteria, budgets }) {
    const within_budget = [];
    const over_budget = [];
    const missing_data = [];

    // index rapide des critères demandés
    const critSet = new Set(criteria.map(c => c.key));

    // helper: lire un budget numérique (nombre ou {max})
    const getBudgetMax = (b) => {
      if (typeof b === 'number') return b;
      const n = Number(b?.max);
      return Number.isFinite(n) ? n : null;
    };

    banks.forEach((bank, bankIndex) => {
      const bankObj = { id: bank.id, name: bank.name };
      let hasExceeded = false;
      let hasMissing = false;
      const exceeded_criteria = [];
      const missing_criteria = [];

      for (const [criterionKey, budgetCfg] of Object.entries(budgets || {})) {
        // on ne considère que les critères effectivement demandés dans "criteria"
        if (!critSet.has(criterionKey)) continue;

        const budgetMax = getBudgetMax(budgetCfg);
        if (!Number.isFinite(budgetMax)) continue; // si budget invalide, on ignore ce critère

        const values = valuesByCriteria?.[criterionKey];
        const v = Array.isArray(values) ? values[bankIndex] : null;

        if (v == null) {
          hasMissing = true;
          missing_criteria.push(criterionKey);
          // on peut stopper tôt, mais on continue pour lister tous les manquants si besoin
          continue;
        }

        const numV = Number(v);
        if (Number.isFinite(numV) && numV > budgetMax) {
          hasExceeded = true;
          exceeded_criteria.push({
            criterion: criterionKey,
            budget: budgetMax,
            actual: numV,
            excess: numV - budgetMax
          });
        }
      }

      if (hasMissing) {
        missing_data.push({ bank: bankObj, missing_criteria });
      } else if (hasExceeded) {
        over_budget.push({ bank: bankObj, exceeded_criteria });
      } else {
        within_budget.push({ bank: bankObj, status: 'Respecte tous les budgets' });
      }
    });

    return { within_budget, over_budget, missing_data };
  }
}

module.exports = ScoreResultBuilder;