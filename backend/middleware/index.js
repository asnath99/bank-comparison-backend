const { validationResult } = require('express-validator');

/**
 * Middleware générique pour traiter les erreurs de validation
 * Utilisable dans tous les validateurs
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Erreurs de validation',
      details: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next(); 
};

module.exports = {
  handleValidationErrors
};