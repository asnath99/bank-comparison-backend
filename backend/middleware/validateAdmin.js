// middlewares/validateAdmin.js
const { body } = require('express-validator');
const { handleValidationErrors } = require('./index');

const validateAdmin = [
  body('email')
    .notEmpty()
    .withMessage('L\'email est obligatoire')
    .trim()
    .isEmail()
    .withMessage('L\'email doit être valide')
    .isLength({ max: 255 })
    .withMessage('L\'email ne peut excéder 255 caractères'),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est obligatoire')
    .isLength({ min: 6, max: 255 })
    .withMessage('Le mot de passe doit contenir entre 6 et 255 caractères'),
  body('role')
    .optional()
    .isIn(['admin', 'super-admin'])
    .withMessage('Le rôle doit être "admin" ou "super-admin"')
];

const validateAdminUpdate = [
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('L\'email doit être valide')
    .isLength({ max: 255 })
    .withMessage('L\'email ne peut excéder 255 caractères'),
  body('password')
    .optional()
    .isLength({ min: 6, max: 255 })
    .withMessage('Le mot de passe doit contenir entre 6 et 255 caractères'),
  body('role')
    .optional()
    .isIn(['admin', 'super-admin'])
    .withMessage('Le rôle doit être "admin" ou "super-admin"')
];

module.exports = {
  validateAdmin: [validateAdmin, handleValidationErrors],
  validateAdminUpdate: [validateAdminUpdate, handleValidationErrors],
};