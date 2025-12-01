const { body} = require('express-validator');
const { handleValidationErrors } = require('./index');

// Règles de validation pour les banques
const validateBankRules = [
  // Validation du nom - obligatoire et plus stricte
  body('name')
    .notEmpty()
    .withMessage('Le nom est obligatoire')
    .trim()
    .isLength({ min: 2, max: 255 })
    .withMessage('Le nom doit contenir entre 2 et 255 caractères')
    .matches(/^[a-zA-ZÀ-ÿ0-9\s-.&'()]+$/)
    .withMessage('Le nom ne peut contenir que des lettres, chiffres, espaces et caractères spéciaux courants'),

  // Validation de l'URL du logo - optionnelle mais stricte si fournie
  body('logo_url')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isURL({
      protocols: ['http', 'https'],
      require_protocol: true,
      require_valid_protocol: true
    })
    .withMessage('L\'URL du logo doit être une URL valide (http ou https)')
    .isLength({ max: 500 })
    .withMessage('L\'URL du logo ne peut excéder 500 caractères')
    // Vérifier que c'est bien une image (optionnel mais recommandé)
    .matches(/\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i)
    .withMessage('L\'URL doit pointer vers un fichier image valide'),

  // Validation de la description - optionnelle
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('La description doit contenir entre 10 et 1000 caractères si elle est fournie')
    .custom(value => {
      if (!value) return true; // Si pas de valeur, c'est OK (déjà géré par optional)
      return !/<[^>]*>/.test(value);
    })
    .withMessage('La description ne peut pas contenir de balises HTML')

];


module.exports = {
  validateBank: [validateBankRules, handleValidationErrors],
};