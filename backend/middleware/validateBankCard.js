const { body } = require('express-validator');
const { handleValidationErrors } = require('./index');

// Règles de validation
const validateBankCardRules = [

  // Validation du card_type - obligatoire et plus stricte
  body('card_type')
    .notEmpty()
    .withMessage('Le nom de la carte est requis')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom de la carte doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s-.&'()]+$/)
    .withMessage('Le nom de la carte ne peut contenir que des lettres, chiffres, espaces et caractères spéciaux courants'),

  // Validation de fee - optionnel, doit être un nombre positif ou nul
  body('fee')
    .optional({ checkFalsy: true })
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('fees doit être un nombre décimal avec au plus 2 chiffres après la virgule')
    .bail()
    .custom(value => parseFloat(value) >= 0)
    .withMessage('fees doit être positif'),
    
  // Validation de fee_is_ttc
  body('fee_is_ttc')
    .optional()
    .toBoolean()  // Convertit la chaine de caractère avant de valider
    .isBoolean()  // Vérifie que la valeur reçu après conversion est un booléen
    .withMessage('fee_is_ttc doit être un booléen (true/false)'),

  body('frequency')
    .isIn(['an', 'mois'])
    .withMessage("frequency doit être 'an' ou 'mois'"),

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
  validateBankCard: [validateBankCardRules, handleValidationErrors]
};