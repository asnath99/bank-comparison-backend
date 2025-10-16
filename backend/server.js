const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const bankRoutes = require('./routes/bankRoutes');
const bankaccountRoutes = require('./routes/bankaccountRoutes');
const bankcardRoutes = require('./routes/bankcardRoutes');
const bankproductRoutes = require('./routes/bankproductRoutes');
const comparisonRoutes = require('./routes/comparisonRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middlewares
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
app.get('/', (req, res) => {
    res.send("hellodd");
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

