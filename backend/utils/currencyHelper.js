const currencyCodes = require('currency-codes');

// Mapping  pour l'affichage personnalisé
const customCurrencyDisplay = {
  'XOF': 'F CFA',        // Franc CFA Ouest
//'XAF': 'XAF',        // Franc CFA Central  

  // Peut être ajouter selon les besoins
};

// Fonction pour la convertion en code ISO
const displayToISOCode = (displayValue) => {
  // Vérifie d'abord si la valeur entrée est déjà un code ISO, si oui la retourne
  if (currencyCodes.code(displayValue?.toUpperCase())) {
    return displayValue.toUpperCase();
  }
  
  // Sinon, essaie de la traduire en code ISO (ex: XOF) via le mapping customCurrencyDisplay
  const isoCode = Object.keys(customCurrencyDisplay).find(
    code => customCurrencyDisplay[code].toLowerCase() === displayValue?.toLowerCase()
  );
  
  return isoCode || displayValue;
};

// Fonction pour l'affichage personnalisé
const formatCurrencyForDisplay = (isoCode) => {
  return customCurrencyDisplay[isoCode] || isoCode;
};

//Format d'affichage
const formatBankAccountResponse = (account) => {
  return {
    ...account,
    currency_display: formatCurrencyForDisplay(account.currency), // "F CFA"
    currency_code: account.currency // "XOF" (pour APIs externes)
  };
};

module.exports = {
  customCurrencyDisplay,
  displayToISOCode,
  formatCurrencyForDisplay,
  formatBankAccountResponse
};