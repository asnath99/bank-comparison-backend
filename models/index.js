'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
require('dotenv').config();

const basename = path.basename(__filename);
const db = {};

/*const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT,
    logging: false, // désactiver les logs SQL pour plus de clarté
  }*/
 const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  protocol: "postgres",
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  }
}
);

// Tester la connexion
// sequelize.authenticate()
//   .then(() => {
//     console.log(' Connexion à PostgreSQL réussie via Sequelize.');
//   })
//   .catch(err => {
//     console.error(' Erreur de connexion à PostgreSQL :', err);
//   });

// Chargement automatique des modèles
fs.readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&    //ignorer les fichiers cachés (qui commencent par '.')
    file !== basename &&          // ignorer - ce fichier index.js lui-même (basename)
    file.slice(-3) === '.js'      // ignorer - les fichiers qui ne finissent pas par '.js'
  )
  .forEach(file => {
    // Charger chaque fichier modèle
    const modelPath = path.join(__dirname, file);
    const model = require(modelPath)(sequelize, Sequelize.DataTypes);

    // Vérifier que le module exporte bien un modèle Sequelize valide
    if (model.prototype instanceof Sequelize.Model) {
      db[model.name] = model;    // Ajoute le modèle dans l'objet db avec sa clé model.name
    } else {
      console.warn(`Le fichier ${file} n'exporte pas un modèle Sequelize valide.`);
    }
  });



// Création des associations
Object.keys(db).forEach(modelName => {
  const model = db[modelName];
  if (model.associate) {
    model.associate(db);
  }
});

// Exporte l'objet db avec tous les modèles Sequelize
// - l'instance sequelize pour interagir avec la base
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
