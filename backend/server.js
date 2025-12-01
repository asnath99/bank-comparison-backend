require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Sentry = require('@sentry/node');

const rateLimit = require('express-rate-limit');

const bankRoutes = require('./routes/bankRoutes');
const bankaccountRoutes = require('./routes/bankaccountRoutes');
const bankcardRoutes = require('./routes/bankcardRoutes');
const bankproductRoutes = require('./routes/bankproductRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cardRoutes = require('./routes/cardRoutes');

const app = express();

// Initialisation Sentry (erreurs uniquement)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

// Middlewares Sentry
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('combined'));



// Limite pour les API publiques (100 requêtes / 1 heure)
const publicApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: 100, 
  message: {
    error: "Trop de requêtes. Réessayez dans une heure.",
  },
  standardHeaders: true, 
  legacyHeaders: false,
});

// Limite pour le login admin (5 tentatives / 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    error: "Trop de tentatives de connexion. Réessayez plus tard.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// pour les routes publiques
app.use('/api/public', publicApiLimiter);

// pour les routes de connexion admin
app.use('/api/admin/login', loginLimiter);

app.use('/api', cardRoutes);

// Routes API
app.use('/api/banks', require('./routes/bankRoutes'));
app.use('/api/bankaccounts', require('./routes/bankaccountRoutes'));
app.use('/api/bankcards', require('./routes/bankcardRoutes'));
app.use('/api/bankproducts', require('./routes/bankproductRoutes'));
app.use('/api/comparison', require('./routes/comparisonRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Route test Sentry
app.get('/debug-sentry', (req, res) => {
  throw new Error('Test Sentry - erreur volontaire !');
});

// Middleware d’erreurs générique
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err);
  res.status(500).json({ error: 'Une erreur est survenue sur le serveur.' });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
