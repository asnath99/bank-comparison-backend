const { body } = require('express-validator');
const currencyCodes = require('currency-codes');
const { displayToISOCode } = require('../utils/currencyHelper');
const { handleValidationErrors } = require('./index');

// Règles de validation pour les comptes
const validateBankAccountRules = [
  // Validation du type - obligatoire et plus stricte
  body('type')
    .notEmpty()
    .withMessage('Le type de compte est requis')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le type de compte doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s-.&'()]+$/)
    .withMessage('Le type de compte ne peut contenir que des lettres, chiffres, espaces et caractères spéciaux courants'),

  // Validation de monthly_fee - optionnel, doit être un nombre positif ou nul
  body('monthly_fee')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('monthly_fee doit être un nombre décimal avec au plus 2 chiffres après la virgule')
    .bail()
    .custom(value => parseFloat(value) >= 0)
    .withMessage('monthly_fee doit être positif'),

  // Validation de monthly_fee_is_ttc
  body('monthly_fee_is_ttc')
    .optional()
    .toBoolean()  // Convertit la chaine de caractère avant de valider
    .isBoolean()  // Vérifie que la valeur reçu après conversion est un booléen
    .withMessage('monthly_fee_is_ttc doit être un booléen (true/false)'),

  // Validation de has_variable_fees    
  body('has_variable_fees')
    .optional()
    .toBoolean()  
    .isBoolean()  
    .withMessage('has_variable_fees doit être un booléen'),

  // Validation pour variable_fee_rules (JSON flexible)
  body('variable_fee_rules')
    .optional()
    //Transforme la donnée avant la validation
    .customSanitizer(value => {
      // Normalise, si la valeur est de type string, la parse
      if (typeof value === 'string') {
        try {
          return JSON.parse(value);
        } catch {
          return value; // Laisse l'erreur être gérée par la validation
        }
      }
      return value;
    })
    //Valide la donnée après transformation
    .custom(value => {
      // Si pas de valeur, c'est OK
      if (!value) return true;
      
      try {
        // Si value est déjà un objet, pas besoin de parser
        if (typeof value === 'object') {
          JSON.stringify(value); // Vérifie que value est sérialisable
          return true;
        }
        
        // Si value est de type string, on essaie de parser
        if (typeof value === 'string') {
          const parsed = JSON.parse(value);
          
          // Vérifie que c'est bien un objet 
          if (typeof parsed !== 'object' || parsed === null) {
            throw new Error('Le JSON doit être un objet ou un tableau');
          }
          
          return true;
        }
        
        throw new Error('Format non supporté');
        
      } catch (error) {
        throw new Error(`JSON invalide: ${error.message}`);
      }
    })
    .withMessage('variable_fee_rules doit être un JSON valide (objet ou tableau)')
    // Validation de taille pour éviter les JSON trop volumineux
    .custom(value => {
      if (!value) return true;
      
      const jsonString = JSON.stringify(value);
      if (jsonString.length > 10000) { // 10KB max
        throw new Error('Le JSON est trop volumineux (max 10KB)');
      }
      
      return true;
    })
    .withMessage('Le JSON ne doit pas dépasser 10KB'),

  // Validation pour currency
  body('currency')
    .optional()
    .trim()
    .customSanitizer(value => {
      if (!value) return 'XOF'; // Valeur par défaut
      
      // Convertit l'affichage local vers le code ISO
      return displayToISOCode(value);
    })    
    .custom((value) => {
      // Vérifie que le code ISO final est valide
      const exists = currencyCodes.code(value);
      if (!exists) {
        throw new Error(`Devise "${value}" invalide selon la norme ISO 4217`);
      }
      return true;
    })
    .withMessage('Devise invalide'),


  // Validation pour notes
  body('notes')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('La note ne doit pas dépasser 500 caractères')
    .custom(value => !/<[^>]*>/.test(value))
    .withMessage('La note ne peut pas contenir de balises HTML'),

  body('bank_id')
    .notEmpty()
    .withMessage('L\'ID de la banque est requis')
    .isInt({ min: 1 })
    .withMessage('L\'ID de la banque doit être un entier positif')
];


module.exports = {
  validateBankAccount: [validateBankAccountRules, handleValidationErrors]
};