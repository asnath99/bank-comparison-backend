'use strict';
/**
 * Pour l'exécution des règles
 */
const { Engine, Rule } = require('json-rules-engine');

class RuleExecutor {
  constructor() {
    this.engineCache = new Map();
    this.maxCacheSize = 100; // par défaut
  }

  setMaxCacheSize(maxSize = 100) {
    this.maxCacheSize = Math.max(1, Number(maxSize) || 100);
    this.pruneIfNeeded();
  }

  pruneIfNeeded() {
    while (this.engineCache.size > this.maxCacheSize) {
      const firstKey = this.engineCache.keys().next().value;
      this.engineCache.delete(firstKey);
    }
  }

  normalizeRuleDefinition(rawRule) {
    return rawRule?.definition || rawRule?.rule_definition || rawRule || {};
  }

  isValidRuleDefinition(def) {
    return def && typeof def === 'object' && def.conditions && def.event && (def.event.type || def.event.params?.type);
  }

  // Création d'un hash pour identifier les combinaisons de règles
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  //Crée une clé unique qui identifie un moteur compilé pour un critère + ensemble de règles spécifique.
  generateCacheKey(criteriaKey, rules) {
    const parts = (rules || []).map(r => {
      const def = this.normalizeRuleDefinition(r);
      const id  = r.id || '';
      const pr  = r.priority || 0;
      return `${id}:${pr}:${JSON.stringify(def)}`;
    }).sort().join('|');
    return `${criteriaKey}:${this.hashString(parts)}`;
  }

  // Compile les règles pour un critère avec cache
  compileEngineForCriteria(criteriaKey, rules = []) {
    const cacheKey = this.generateCacheKey(criteriaKey, rules);
    if (this.engineCache.has(cacheKey)) return this.engineCache.get(cacheKey);

    const engine = new Engine([], { allowUndefinedFacts: true });

    for (const rawRule of rules) {
      const def = this.normalizeRuleDefinition(rawRule);
      if (!this.isValidRuleDefinition(def)) continue;
      try {
        engine.addRule(new Rule(def));
      } catch (err) {
        console.warn(`Règle invalide ignorée pour ${criteriaKey}:`, err.message, def);
      }
    }

    this.engineCache.set(cacheKey, engine);
    this.pruneIfNeeded(); 
    return engine;
  }

  async executeRulesForBank(criteriaKey, rules, facts, baseScore = 0) {
    if (!rules || rules.length === 0) {
      return { score: baseScore, excluded: false, notes: [] };
    }
    const engine = this.compileEngineForCriteria(criteriaKey, rules);
    const events = [];
    const listener = (event, almanac) => events.push({ ...event, almanac });

    try {
      engine.on('success', listener);
      await engine.run(facts);
      return this.processRuleEvents(events, baseScore);
    } catch (error) {
      console.error(`Erreur règles ${criteriaKey}:`, error);
      return { score: baseScore, excluded: false, notes: [`Erreur d'exécution: ${error.message}`] };
    } finally {
      engine.removeListener('success', listener);
    }
  }

  processRuleEvents(events, baseScore) {
    let score = Number(baseScore) || 0;
    let excluded = false;
    const notes = [];
    let display;
    let sortKey;

    const sorted = events.sort((a, b) => (b.params?.priority || 0) - (a.params?.priority || 0));
    for (const ev of sorted) {
      const res = this.applyRuleEvent(ev, score);
      score = res.score;
      if (res.excluded) excluded = true;
      if (res.note) notes.push(res.note);
      if (res.display !== undefined) display = res.display;
      if (res.sortKey !== undefined) sortKey = res.sortKey;
    }

    score = Math.max(0, Math.min(100, score));
    return { score, excluded, notes, display, sortKey };
  }

  applyRuleEvent(event, currentScore) {
    const typeRaw = (event.type || event.params?.type || '').toLowerCase();
    const params  = event.params || {};
    let score = currentScore;
    let excluded = false;

    switch (typeRaw) {
      case 'bonus': {
        const add = Number(params.add || params.bonus);
        if (Number.isFinite(add)) score += add;
        break;
      }
      case 'malus':
      case 'penalty': {
        const sub = Number(params.sub || params.subtract || params.penalty);
        if (Number.isFinite(sub)) score -= sub;
        break;
      }
      case 'set-score': {
        const s = Number(params.score);
        if (Number.isFinite(s)) score = s;
        break;
      }
      case 'multiply-score': {
        const m = Number(params.multiplier || params.factor);
        if (Number.isFinite(m)) score *= m;
        break;
      }
      case 'set-min-score': {
        const mn = Number(params.min);
        if (Number.isFinite(mn)) score = Math.max(score, mn);
        break;
      }
      case 'set-max-score': {
        const mx = Number(params.max);
        if (Number.isFinite(mx)) score = Math.min(score, mx);
        break;
      }
      case 'exclude':
      case 'disqualify':
      case 'exclude-global': {
        excluded = true;
        break;
      }
      case 'set-display': {
        const value = params.value;
        return { score, excluded, note: params.explanation || params.note, display: String(value) };
      }
      case 'set-sort': {
        const k = Number(params.key);
        if (Number.isFinite(k)) {
          return { score, excluded, note: params.explanation || params.note, sortKey: k };
        }
        return { score, excluded, note: params.explanation || params.note };
      }
      default:
        // inconnu: on ignore
        break;
    }

    return { score, excluded, note: params.explanation || params.note };
  }
}

const ruleExecutor = new RuleExecutor();
module.exports = { RuleExecutor, ruleExecutor };
