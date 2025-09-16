'use strict';
/**
 * Traduit les données bancaires en format que le moteur de règles peut comprendre.
 */
class FactsBuilder {
  /**
   * Crée les facts standardisés pour json-rules-engine
   */
  buildFactsForBank(rawValue, bank, criteriaKey, mode, bankIndex = null) {
    const num = this.parseNumericValue(rawValue);
    
    return {
      value: rawValue,
      numeric_value: num,
      missing: this.isMissingValue(rawValue),
      is_zero: num === 0,
      is_positive: num !== null && num > 0,
      is_negative: num !== null && num < 0,
      bank: {
        id: bank.id,
        name: bank.name,
        ...(bankIndex !== null && { index: bankIndex })
      },
      criteria_key: criteriaKey,
      mode
    };
  }

  parseNumericValue(value) {
    if (this.isMissingValue(value)) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
  }

  isMissingValue(value) {
    return value === null || value === undefined || value === '';
  }
}

module.exports = FactsBuilder;