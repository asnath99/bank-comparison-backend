require('dotenv').config();
const { sequelize } = require('./models');
const { Bank, BankAccount, BankCard } = require('./models');

const banksData = [
  {
    name: "BOA (Banque of Africa)",
    accounts: [
      { type: "Compte individuel", fees: 4025 },
      { type: "Compte salarié", fees: 4025 },
      { type: "Compte entreprise <30M FCFA CA", fees: 3000 },
      { type: "Compte entreprise >30M FCFA CA", fees: 9000 },
      { type: "Compte d'épargne", fees: null },
      { type: "Compte commerçant", fees: null }
    ],
    cards: []
  },
  {
    name: "BSIC (Banque Sahélo-Saharienne)",
    accounts: [
      { type: "Compte individuel", fees: 1180 },
      { type: "Compte salarié", fees: 1180 },
      { type: "Compte entreprise", fees: 5900 },
      { type: "Compte d'épargne", fees: null },
      { type: "Compte commerçant", fees: null }
    ],
    cards: [
      { card_type: "Carte Azur", fee: 1250 },
      { card_type: "Carte Gold", fee: 1500 },
      { card_type: "Carte Platinum", fee: 2000 },
      { card_type: "Carte physique", fee: null }
    ]
  },
  {
    name: "Ecobank Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: 1500 },
      { type: "Compte salarié", fees: 1500 },
      { type: "Compte entreprise", fees: 6000 },
      { type: "Compte d'épargne", fees: 0 },
      { type: "Compte commerçant", fees: null }
    ],
    cards: [
      { card_type: "Carte classique particulière", fee: 4950 },
      { card_type: "Carte entreprise individuelle", fee: 12500 }
    ]
  },
  {
    name: "BADF Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: 5000 },
      { type: "Compte salarié", fees: null },
      { type: "Compte entreprise", fees: 5000 },
      { type: "Compte d'épargne", fees: 0 },
      { type: "Compte commerçant", fees: null }
    ],
    cards: [
      { card_type: "Carte GIM Particulier", fee: 5000 },
      { card_type: "Carte GIM Pro", fee: 10000 }
    ]
  },
  {
    name: "WBI (Wendkuni Bank International)",
    accounts: [
      { type: "Compte individuel", fees: 2500 },
      { type: "Compte salarié", fees: null },
      { type: "Compte entreprise", fees: 5750 },
      { type: "Compte d'épargne", fees: null },
      { type: "Compte commerçant", fees: null }
    ],
    cards: []
  },
  {
    name: "Vista Bank Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: 1500 },
      { type: "Compte salarié", fees: 1500 },
      { type: "Compte entreprise", fees: 6000 },
      { type: "Compte d'épargne", fees: null },
      { type: "Compte commerçant", fees: null }
    ],
    cards: [
      { card_type: "Carte Visa individuelle", fee: 9000 },
      { card_type: "Carte Visa commerçant/profession", fee: 12500 },
      { card_type: "Carte Issuée Horizon", fee: 12000 }
    ]
  },
  {
    name: "Banque Commerciale du Burkina (BCB)",
    accounts: [
      { type: "Compte individuel", fees: 1500 },
      { type: "Compte salarié", fees: 1500 },
      { type: "Compte entreprise", fees: 6000 },
      { type: "Compte d'épargne", fees: null },
      { type: "Compte commerçant", fees: null }
    ],
    cards: [
      { card_type: "Visa Flamboyant", fee: 39000 },
      { card_type: "Visa Premier", fee: 65000 },
      { card_type: "Visa Platinum", fee: 150000 },
      { card_type: "Visa Infinite", fee: 250000 },
      { card_type: "Visa Electron", fee: 17000 },
      { card_type: "Visa Classic", fee: 28375 },
      { card_type: "Visa Gold", fee: 42785 },
      { card_type: "Visa Platinum (autre)", fee: 128125 },
      { card_type: "Prepayée Kalpe", fee: 12500 }
    ]
  },
  {
    name: "Société Générale Burkina Faso (SGBF)",
    accounts: [
      { type: "Compte individuel", fees: 2000 },
      { type: "Compte salarié", fees: null },
      { type: "Compte entreprise (SARL)", fees: 7500 },
      { type: "Compte d'épargne", fees: null },
      { type: "Compte commerçant", fees: null }
    ],
    cards: [
      { card_type: "Carte VISA Classic", fee: 6000 },
      { card_type: "Carte prépayée LIBERTIS", fee: 500 },
      { card_type: "Carte VISA Premier", fee: 18000 }
    ]
  },
  {
    name: "CBAO Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: 1000 },
      { type: "Compte salarié", fees: null },
      { type: "Compte entreprise", fees: 5000 },
      { type: "Compte d'épargne", fees: null },
      { type: "Compte commerçant", fees: null }
    ],
    cards: [
      { card_type: "Visa Classic", fee: 5000 },
      { card_type: "Visa Gold", fee: 10000 },
      { card_type: "Carte prépayée", fee: 0 }
    ]
  },
  {
    name: "Orabank Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: 1100 },
      { type: "Compte salarié", fees: null },
      { type: "Compte entreprise", fees: 500 },
      { type: "Compte d'épargne", fees: 0 },
      { type: "Compte commerçant", fees: 3000 }
    ],
    cards: []
  },
  {
    name: "UBA Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: null },
      { type: "Compte salarié", fees: null },
      { type: "Compte entreprise", fees: null },
      { type: "Compte d'épargne", fees: 0 },
      { type: "Compte commerçant", fees: 3000 }
    ],
    cards: []
  },
  {
    name: "Banque Atlantique Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: 1800 },
      { type: "Compte salarié", fees: 1000 },
      { type: "Compte entreprise", fees: 4000 },
      { type: "Compte d'épargne", fees: 0 },
      { type: "Compte commerçant", fees: 3000 }
    ],
    cards: []
  },
  {
    name: "IB Bank Burkina Faso",
    accounts: [
      { type: "Compte individuel", fees: 1600 },
      { type: "Compte salarié", fees: 1000 },
      { type: "Compte entreprise", fees: 4000 },
      { type: "Compte d'épargne", fees: 0 },
      { type: "Compte commerçant", fees: 2500 }
    ],
    cards: []
  },
  {
    name: "Coris Bank International",
    accounts: [
      { type: "Compte individuel", fees: 995 },
      { type: "Compte salarié", fees: 995 },
      { type: "Compte entreprise", fees: 3000 },
      { type: "Compte d'épargne", fees: 0 },
      { type: "Compte commerçant", fees: 2500 }
    ],
    cards: []
  }
];

(async () => {
  try {
    await sequelize.authenticate();
    console.log(" Connexion PostgreSQL réussie !");
    await sequelize.sync({ alter: true });

    for (const bankData of banksData) {
      const bank = await Bank.create({ name: bankData.name });

      // Comptes
      for (const acc of bankData.accounts) {
        await BankAccount.create({
          bank_id: bank.id,
          type: acc.type,
          fees: acc.fees
        });
      }

      // Cartes
      for (const card of bankData.cards) {
        await BankCard.create({
          bank_id: bank.id,
          card_type: card.card_type,
          fee: card.fee,
          frequency: "an"
        });
      }
    }

    console.log(" Toutes les données insérées avec succès !");
    process.exit(0);
  } catch (err) {
    console.error(" Erreur lors du seed :", err);
    process.exit(1);
  }
})();