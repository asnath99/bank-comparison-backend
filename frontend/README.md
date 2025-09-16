## Architecture générale
Backend : Node.js + Express + Sequelize (PostgreSQL)
API REST structurée en couches (routes, contrôleurs, services, modèles, middleware)
Gestion des banques, comptes, cartes et produits  
Moteur de comparaison dynamique : mode `plain` (résultats bruts) et mode `score` (notation /100)  
Filtres et budgets par critère
Authentification et administration (admin users + logs)
Référentiel devises: IBAN currency codes

## Stack technique
* **Runtime**: Node.js ≥ 18
* **Framework**: Express.js
* **ORM**: Sequelize
* **DB**: PostgreSQL
* **Validation**: express‑validator
* **Auth/Admin**: JWT + middlewares (requireAdmin, authorizeRoles)
* **Utilitaires**: dotenv, cors, morgan, nodemon (dev)
* **Référentiel devises**: [IBAN currency codes](https://www.iban.com/currency-codes)


## Structure des dossiers
backend/
 ├── config/          # Config Sequelize + connexion DB
 ├── models/          # Définition des modèles Sequelize
 ├── controllers/     # Logique des endpoints
 ├── service/         # Couche métier (BankService, ComparisonEngine, etc.)
 ├── routes/          # Définition des routes Express
 ├── middleware/      # Validation, auth
 ├── utils/           # Helpers (formattage, règles, etc.)
 ├── server.js        # Point d’entrée Express
 └── .env             # Variables d’environnement


## Fonctionnalités principales
CRUD complet sur banques, comptes, cartes, produits (via Sequelize services)
Moteur de comparaison (/api/comparison)
Mode plain : tri simple, résultats lisibles
Mode score : notation /100, pondérations, bonus/malus, budgets (A améliorer si utilisation)
Filtres dynamiques (filters) et budgets (budgets) par critère
Gestion JSONB (ex : bank_products.details, variable_fee_rules)
Admin : authentification + logs administrateurs

## Exemple de comparaison en mode plain
{
  "criteria": ["account_monthly_fee", "card_annual_fee"],
  "mode": "score",
    "bankIds": [1,2,3],
  "filters": {
    "account_monthly_fee": {"type": ["COMPTE INDIVIDUEL"]}
   },
   "budgets": {
     "account_monthly_fee": 5000,
     "card_annual_fee": 5000
   }
}



## Démarrage local rapide
cd backend
npm install
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
npm run dev


Serveur dispo par défaut sur : http://localhost:5000/api