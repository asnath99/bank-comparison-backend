/*require('dotenv').config();
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



const app = express();
app.use(cors());
app.use(express.json());

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    Sentry.captureConsoleIntegration(),
    Sentry.httpIntegration({ tracing: true }),
    Sentry.expressIntegration(app),
  ],
  tracesSampleRate: 1.0,
});


// --- Middleware Sentry 
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());


app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('combined'));

//Routes Api
app.use('/api/banks', bankRoutes);
app.use('/api/bankaccounts', bankaccountRoutes);
app.use('/api/bankcards', bankcardRoutes);
app.use('/api/bankproducts', bankproductRoutes);
app.use('/api/comparison', comparisonRoutes);
app.use('/api/admin', adminRoutes);


//Route test
//app.get('/', (req, res) => {
   // res.send("hellodd");
//});
app.get("/debug-sentry", (req, res) => {
  throw new Error("Test d'erreur Sentry !");
});

// Middleware de gestion d'erreurs Sentry
app.use(Sentry.Handlers.errorHandler());

app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err);
  res.status(500).json({ error: 'Une erreur est survenue sur le serveur.' });
});

// Middleware d’erreurs 
//app.use((err, req, res, next) => {
//  console.error("Erreur non gérée :", err);
 // res.status(500).json({ error: "Une erreur est survenue sur le serveur." });
//});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */



require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Sentry = require('@sentry/node');

const rateLimit = require('express-rate-limit');

const app = express();

// Initialisation Sentry (erreurs uniquement)
Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

// Middlewares classiques
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


// Routes API
app.use('/api/banks', require('./routes/bankRoutes'));
app.use('/api/bankaccounts', require('./routes/bankaccountRoutes'));
app.use('/api/bankcards', require('./routes/bankcardRoutes'));
app.use('/api/bankproducts', require('./routes/bankproductRoutes'));
app.use('/api/comparison', require('./routes/comparisonRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Route test Sentry
app.get('/debug-sentry', (req, res) => {
  throw new Error('Test d\'erreur Sentry !');
});

// Middleware d’erreurs générique
app.use((err, req, res, next) => {
  console.error('Erreur non gérée :', err);
  res.status(500).json({ error: 'Une erreur est survenue sur le serveur.' });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
