const { ValidationError, NotFoundError } = require('./errors');

function handleError(res, error) {
  console.error('Erreur capturée:', {
    name: error.name,
    message: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });

  let statusCode = 500;
  let message = 'Erreur interne du serveur';

  // Gestion des erreurs personnalisées
  if (error instanceof ValidationError) {
    statusCode = 400;
    message = error.message;
  } else if (error instanceof NotFoundError) {
    statusCode = 404;
    message = error.message;
  } else if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Erreur de validation des données';
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Cette ressource existe déjà';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    details: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
}

module.exports = { handleError };
