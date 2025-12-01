const { body } = require('express-validator');
const { handleValidationErrors } = require('./index');

// Règles de validation
const validateBankProductRules = [
  // Validation du type - obligatoire et plus stricte
  body('product_type')
    .notEmpty()
    .withMessage('Le type de produit est requis')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le type de produit doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s-.&'()]+$/)
    .withMessage('Le type de produit ne peut contenir que des lettres, chiffres, espaces et caractères spéciaux courants'),

  // Validation du nom - obligatoire et plus stricte
  body('name')
    .notEmpty()
    .withMessage('Le nom est obligatoire')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Le nom doit contenir entre 2 et 255 caractères')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s-.&'()]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, chiffres, espaces et caractères spéciaux courants'),

  // Validation pour details (JSON flexible)
  body('details')
    .optional({ nullable: true, checkFalsy: true })
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
    .withMessage('details doit être un JSON valide (objet ou tableau)')
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

  // Validation de fees        
  body('fees')
    .optional()
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('fees doit être un nombre décimal avec au plus 2 chiffres après la virgule')
    .bail()
    .custom(value => parseFloat(value) >= 0)
    .withMessage('fees doit être positif'),
        
  body('bank_id')
    .notEmpty()
    .withMessage('L\'ID de la banque est requis')
    .isInt({ min: 1 })
    .withMessage('L\'ID de la banque doit être un entier positif')
];

module.exports = {
  validateBankProduct: [validateBankProductRules, handleValidationErrors]
};