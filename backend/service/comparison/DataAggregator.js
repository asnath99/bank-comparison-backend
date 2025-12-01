'use strict';
/**
 * Récupère les valeur par banque
 */
const models = require('../../models');
const { Op } = require('sequelize');

const toNumStrict = (v) => {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

function pickRowByAggregation(rows, path, aggregation = 'min') {
  if (!rows.length) return null;
  const get = (r) => toNumStrict(r[path]);
  switch ((aggregation || 'min').toLowerCase()) {
    case 'min':
      return rows.reduce((best, r) => {
        const vb = get(best), vr = get(r);
        if (vr === null) return best;
        if (vb === null || vr < vb) return r;
        return best;
      }, rows[0]);
    case 'max':
      return rows.reduce((best, r) => {
        const vb = get(best), vr = get(r);
        if (vr === null) return best;
        if (vb === null || vr > vb) return r;
        return best;
      }, rows[0]);
    case 'first':
      return rows[0];
    case 'avg':
      // pas de “ligne représentative” unique pour avg → null
      return null;
    default:
      return rows[0];
  }
}

function applyFilters(row, filters = {}) {
  for (const [k, expected] of Object.entries(filters)) {
    const val = row[k];
    if (Array.isArray(expected)) {
      const want = expected.map(x => String(x).toLowerCase());
      const got  = String(val ?? '').toLowerCase();
      if (!want.includes(got)) return false;
    } else if (typeof expected === 'string') {
      if (String(val ?? '').toLowerCase() !== expected.toLowerCase()) return false;
    } else {
      if (val !== expected) return false;
    }
  }
  return true;
}

function aggregate(nums, method = 'min') {
  if (!nums.length) return null;
  switch ((method || 'min').toLowerCase()) {
    case 'min':   return Math.min(...nums);
    case 'max':   return Math.max(...nums);
    case 'avg':   return nums.reduce((a, b) => a + b, 0) / nums.length;
    case 'first': return nums[0];
    default:      return Math.min(...nums);
  }
}

class DataAggregator {
  async collect(bankIds, criteria, externalFilters = {}) {
    const { Bank } = models;

    const banks = await Bank.findAll({
      where: bankIds?.length ? { id: { [Op.in]: bankIds } } : undefined,
      order: [['id', 'ASC']]
    });

    const bankIdsArr = banks.map(b => b.id);
    const valuesByCriteria = {};
    const pickedIdsByCriteria = {};

    for (const c of criteria) {
    const { model, path, filters = {}, aggregation = 'min' } = c.dataMapping || {};
    if (!model || !path) {
      valuesByCriteria[c.key] = banks.map(() => null);
      pickedIdsByCriteria[c.key] = banks.map(() => null);
      continue;
    }

    const M = models[model];
    if (!M) {
      valuesByCriteria[c.key] = banks.map(() => null);
      pickedIdsByCriteria[c.key] = banks.map(() => null);
      continue;
    }

    const rows = await M.findAll({
      where: { bank_id: { [Op.in]: bankIdsArr } }
    });

    // group by bank
    const byBankId = new Map();
    for (const r of rows) {
      if (!byBankId.has(r.bank_id)) byBankId.set(r.bank_id, []);
      byBankId.get(r.bank_id).push(r);
    }

    valuesByCriteria[c.key] = banks.map(b => {
      const list = byBankId.get(b.id) || [];
      if (!list.length) return null;

      // Combiner filtres internes  externes
      const combinedFilters = { 
        ...filters,  // filtres du critère (dataMapping.filters)
        ...(externalFilters[c.key] || {})  // filtres de la requête API
      };

      const pool = list.filter(r => applyFilters(r, combinedFilters));
      const nums = pool.map(r => toNumStrict(r[path])).filter(n => n !== null);
      
      if (!nums.length) return null;
      return aggregate(nums, aggregation);
    });
 
    // en parallèle, calcule l’ID de la ligne qui a servi (min/max/first)
    pickedIdsByCriteria[c.key] = banks.map(b => {
      const list = byBankId.get(b.id) || [];
      if (!list.length) return null;
      const combinedFilters = { 
        ...filters,
        ...(externalFilters[c.key] || {})
      };
      const pool = list.filter(r => applyFilters(r, combinedFilters));
      if (!pool.length) return null;
      const chosen = pickRowByAggregation(pool, path, aggregation);
      // on suppose la PK = r.id ; sinon adapte ici
      return chosen?.id ?? null;
    });
   }
 
    return { 
      banks: banks.map(b => b.toJSON()), 
      valuesByCriteria,
      pickedIdsByCriteria
    };
   }
 }
 
 module.exports = DataAggregator;
