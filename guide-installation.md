# Guide d'Installation et de Compréhension - Comparateur Bancaire

## Table des Matières
1. [Prérequis et Installation des Outils](#prérequis)
2. [Installation du Projet](#installation-projet)
3. [Configuration et Lancement](#configuration)
4. [Architecture du Projet](#architecture)
5. [Compréhension du Code](#comprehension)
6. [Exercices Pratiques](#exercices)

---

## 1. Prérequis et Installation des Outils {#prérequis}

### 1.1 Vérification du Système
Ouvrez un terminal (Command Prompt sur Windows, Terminal sur Mac/Linux) et tapez :

```bash
# Vérifier la version de votre système
# Sur Windows
systeminfo | findstr "OS Name"

# Sur Mac
sw_vers

# Sur Linux
lsb_release -a
```

### 1.2 Installation de Node.js et npm

**Node.js** est l'environnement d'exécution JavaScript côté serveur. **npm** (Node Package Manager) est installé automatiquement avec Node.js.

1. **Téléchargement :**
   - Allez sur https://nodejs.org/
   - Téléchargez la version LTS (Long Term Support) - actuellement >= 18
   - Installez en suivant les instructions de l'assistant

2. **Vérification de l'installation :**
   ```bash
   node --version
   npm --version
   ```

   Vous devriez voir quelque chose comme :
   ```
   v20.x.x
   10.x.x
   ```

### 1.3 Installation de Git

**Git** est un système de contrôle de version distribué.

1. **Téléchargement :**
   - Allez sur https://git-scm.com/
   - Téléchargez et installez pour votre système

2. **Configuration initiale :**
   ```bash
   git config --global user.name "Votre Nom"
   git config --global user.email "votre.email@example.com"
   ```

3. **Vérification :**
   ```bash
   git --version
   ```

### 1.4 Installation de PostgreSQL

**PostgreSQL** est le système de gestion de base de données utilisé par le projet.

1. **Téléchargement :**
   - Allez sur https://www.postgresql.org/download/
   - Choisissez votre système d'exploitation
   - Installez avec les paramètres par défaut
   - **Important :** Notez le mot de passe du superutilisateur `postgres`

2. **Vérification :**
   ```bash
   psql --version
   ```

### 1.5 Éditeur de Code (Recommandé)

Installez **Visual Studio Code** :
- Téléchargez depuis https://code.visualstudio.com/
- Installez les extensions recommandées :
  - JavaScript (ES6) code snippets
  - GitLens
  - PostgreSQL
  - Auto Rename Tag
  - Bracket Pair Colorizer

---

## 2. Installation du Projet {#installation-projet}

### 2.1 Clonage du Repository

```bash
# Naviguez vers le dossier où vous voulez installer le projet
cd ~/Documents

# Clonez le repository
git clone [URL_DU_REPOSITORY]
cd bank-comparison

# Vérifiez la structure
ls -la
```

Vous devriez voir :
```
backend/
frontend/
documentation-api-endpoints.md
.gitignore
.github/
```

### 2.2 Installation des Dépendances Backend

```bash
# Naviguez vers le dossier backend
cd backend

# Installez les dépendances
npm install

# Vérifiez que l'installation s'est bien passée
ls node_modules
```

**Dépendances principales installées :**
- **express** (^5.1.0) : Framework web Node.js
- **sequelize** (^6.37.7) : ORM (Object-Relational Mapping)
- **pg** (^8.16.3) : Driver PostgreSQL
- **bcrypt** (^6.0.0) : Hachage des mots de passe
- **jsonwebtoken** (^9.0.2) : Authentification JWT
- **cors** (^2.8.5) : Cross-Origin Resource Sharing
- **dotenv** (^17.2.0) : Variables d'environnement

### 2.3 Installation des Dépendances Frontend

```bash
# Revenez au dossier racine et naviguez vers frontend
cd ../frontend

# Installez les dépendances
npm install
```

**Dépendances principales installées :**
- **react** (^19.1.1) : Bibliothèque UI
- **vite** (^7.1.2) : Outil de build et serveur de développement
- **typescript** (~5.8.3) : Langage avec typage statique
- **tailwindcss** (^4.1.12) : Framework CSS utilitaire
- **@tanstack/react-query** (^5.85.5) : Gestion des requêtes et cache
- **axios** (^1.11.0) : Client HTTP
- **react-router-dom** (^7.8.1) : Routage côté client

---

## 3. Configuration et Lancement {#configuration}

### 3.1 Configuration de la Base de Données

1. **Créer la base de données :**
   ```bash
   # Se connecter à PostgreSQL (remplacez 'votre_mot_de_passe')
   psql -U postgres -h localhost

   # Dans le shell PostgreSQL
   CREATE DATABASE bank_comparison;
   \q
   ```

2. **Configuration des variables d'environnement :**
   ```bash
   # Dans le dossier backend
   cd backend

   # Créez le fichier .env
   touch .env
   ```

   Éditez le fichier `.env` avec le contenu suivant :
   ```env
   # Base de données
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bank_comparison
   DB_USER=postgres
   DB_PASSWORD=votre_mot_de_passe_postgres

   # JWT
   JWT_SECRET=votre_secret_jwt_très_sécurisé_ici
   JWT_EXPIRES_IN=24h

   # Serveur
   PORT=5000
   NODE_ENV=development
   ```

### 3.2 Initialisation de la Base de Données

```bash
# Dans le dossier backend
cd backend

# Créer la base de données (si pas déjà fait)
npx sequelize db:create

# Exécuter les migrations (créer les tables)
npx sequelize db:migrate

# Exécuter les seeders (données d'exemple)
npx sequelize db:seed:all
```

### 3.3 Lancement des Serveurs

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

Vous devriez voir :
```
[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node server.js`
Serveur démarré sur le port 5000
Base de données connectée avec succès
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

Vous devriez voir :
```
  VITE v7.1.2  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 3.4 Vérification du Fonctionnement

1. **Backend :** Ouvrez http://localhost:5000/api/banks dans votre navigateur
2. **Frontend :** Ouvrez http://localhost:5173/ dans votre navigateur

---

## 4. Architecture du Projet {#architecture}

### 4.1 Vue d'Ensemble

Le projet suit une architecture **client-serveur** avec séparation complète :

```
bank-comparison/
├── backend/           # API REST (Node.js + Express + Sequelize)
├── frontend/          # Interface utilisateur (React + TypeScript + Vite)
└── documentation/     # Documentation de l'API
```

### 4.2 Architecture Backend

```
backend/
├── config/           # Configuration Sequelize et base de données
├── controllers/      # Logique des endpoints API
├── middleware/       # Validation, authentification, autorisation
├── models/          # Modèles de données Sequelize
├── routes/          # Définition des routes Express
├── seeders/         # Données d'exemple pour la base de données
├── service/         # Couche métier (BankService, ComparisonEngine)
├── utils/           # Fonctions utilitaires
├── migrations/      # Scripts de migration de base de données
├── server.js        # Point d'entrée de l'application
└── .env            # Variables d'environnement
```

**Flux de traitement d'une requête :**
1. **Route** (`routes/`) : Définit l'URL et la méthode HTTP
2. **Middleware** (`middleware/`) : Validation, authentification
3. **Contrôleur** (`controllers/`) : Traite la requête
4. **Service** (`service/`) : Logique métier complexe
5. **Modèle** (`models/`) : Interaction avec la base de données

### 4.3 Architecture Frontend

```
frontend/
├── src/
│   ├── components/   # Composants React réutilisables
│   ├── pages/       # Pages de l'application
│   ├── hooks/       # Custom React hooks
│   ├── store/       # Gestion de l'état global (Zustand)
│   ├── services/    # Services API (Axios)
│   ├── types/       # Types TypeScript
│   ├── utils/       # Fonctions utilitaires
│   └── App.tsx      # Composant racine
├── public/          # Fichiers statiques
├── vite.config.ts   # Configuration Vite
└── package.json     # Dépendances et scripts
```

### 4.4 Base de Données - Modèle Conceptuel

**Entités principales :**

1. **Bank** : Informations sur les banques
   - `id`, `name`, `logo_url`, `description`, `is_active`

2. **BankAccount** : Types de comptes proposés
   - `id`, `bank_id`, `type`, `monthly_fee`, `currency`

3. **BankCard** : Cartes bancaires disponibles
   - `id`, `bank_id`, `card_type`, `fee`, `frequency`

4. **BankProduct** : Autres produits (assurance, crédit)
   - `id`, `bank_id`, `product_type`, `name`, `details` (JSONB)

5. **AdminUser** : Utilisateurs administrateurs
   - `id`, `email`, `password_hash`, `role`

6. **ComparisonCriteria** : Critères de comparaison
   - `id`, `key`, `label`, `data_mapping`, `scoring_strategy`

---

## 5. Compréhension du Code {#comprehension}

### 5.1 Backend - Analyse du Code

#### Point d'Entrée : `server.js`

```javascript
// Chargement des variables d'environnement
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Création de l'application Express
const app = express();

// Middlewares globaux
app.use(cors());                    // Autoriser les requêtes cross-origin
app.use(express.json());            // Parser JSON
app.use(express.urlencoded({        // Parser form data
  extended: true
}));

// Import des routes
const bankRoutes = require('./routes/bankRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Utilisation des routes
app.use('/api/banks', bankRoutes);
app.use('/api/admin', adminRoutes);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
```

#### Exemple de Contrôleur : `controllers/bankController.js`

```javascript
const BankService = require('../service/BankService');

class BankController {
  // Récupérer toutes les banques
  async getAllBanks(req, res) {
    try {
      const banks = await BankService.findAll();
      res.json({
        success: true,
        data: banks,
        count: banks.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des banques',
        error: error.message
      });
    }
  }

  // Créer une nouvelle banque
  async createBank(req, res) {
    try {
      const bankData = req.body;
      const newBank = await BankService.create(bankData);

      res.status(201).json({
        success: true,
        message: 'Banque créée avec succès',
        data: newBank
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Erreur lors de la création de la banque',
        error: error.message
      });
    }
  }
}

module.exports = new BankController();
```

#### Exemple de Modèle : `models/Bank.js`

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bank = sequelize.define('Bank', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  logo_url: {
    type: DataTypes.STRING,
    validate: {
      isUrl: true
    }
  },
  description: {
    type: DataTypes.TEXT
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'banks',
  timestamps: true,
  underscored: true
});

module.exports = Bank;
```

### 5.2 Frontend - Analyse du Code

#### Structure des Composants React

**Exemple : `components/BankList.tsx`**

```typescript
import React, { useState, useEffect } from 'react';
import { Bank } from '../types/Bank';
import { bankService } from '../services/bankService';

interface BankListProps {
  onBankSelect?: (bank: Bank) => void;
}

const BankList: React.FC<BankListProps> = ({ onBankSelect }) => {
  // État local du composant
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effet pour charger les données au montage
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        setLoading(true);
        const response = await bankService.getAll();
        setBanks(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des banques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  // Gestion du clic sur une banque
  const handleBankClick = (bank: Bank) => {
    if (onBankSelect) {
      onBankSelect(bank);
    }
  };

  // Rendu conditionnel
  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="bank-list">
      <h2>Liste des Banques</h2>
      {banks.map(bank => (
        <div
          key={bank.id}
          className="bank-item"
          onClick={() => handleBankClick(bank)}
        >
          <img src={bank.logo_url} alt={bank.name} />
          <h3>{bank.name}</h3>
          <p>{bank.description}</p>
        </div>
      ))}
    </div>
  );
};

export default BankList;
```

#### Service API : `services/bankService.ts`

```typescript
import axios from 'axios';
import { Bank } from '../types/Bank';

const API_BASE_URL = 'http://localhost:5000/api';

class BankService {
  private baseURL = `${API_BASE_URL}/banks`;

  // Récupérer toutes les banques
  async getAll(): Promise<{ data: Bank[], count: number }> {
    try {
      const response = await axios.get(this.baseURL);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des banques:', error);
      throw error;
    }
  }

  // Récupérer une banque par ID
  async getById(id: number): Promise<Bank> {
    try {
      const response = await axios.get(`${this.baseURL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la banque ${id}:`, error);
      throw error;
    }
  }

  // Créer une nouvelle banque
  async create(bankData: Partial<Bank>): Promise<Bank> {
    try {
      const response = await axios.post(this.baseURL, bankData);
      return response.data.data;
    } catch (error) {
      console.error('Erreur lors de la création de la banque:', error);
      throw error;
    }
  }
}

export const bankService = new BankService();
```

#### Types TypeScript : `types/Bank.ts`

```typescript
export interface Bank {
  id: number;
  name: string;
  logo_url?: string;
  description?: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BankAccount {
  id: number;
  bank_id: number;
  type: string;
  monthly_fee: number;
  monthly_fee_is_ttc: boolean;
  has_variable_fees: boolean;
  variable_fee_rules?: Record<string, any>;
  currency: string;
  notes?: string;
  bank?: Bank;
}

export interface BankCard {
  id: number;
  bank_id: number;
  card_type: string;
  fee: number;
  fee_is_ttc: boolean;
  frequency: 'an' | 'mois';
  notes?: string;
  bank?: Bank;
}
```

### 5.3 Moteur de Comparaison

Le cœur du système est le moteur de comparaison situé dans `backend/service/ComparisonEngine.js`.

#### Fonctionnement :

1. **Collecte des données** selon les critères demandés
2. **Application des filtres** (ex: type de compte)
3. **Calcul des scores** selon la stratégie définie
4. **Application des budgets** (malus si dépassement)
5. **Tri et retour des résultats**

#### Exemple d'utilisation :

```javascript
// Requête de comparaison
const comparisonRequest = {
  criteria: ['account_monthly_fee', 'card_annual_fee'],
  mode: 'score',
  bankIds: [1, 2, 3],
  filters: {
    account_monthly_fee: { type: ['COMPTE COURANT'] }
  },
  budgets: {
    account_monthly_fee: 5000,
    card_annual_fee: 20000
  }
};

// Résultat
{
  mode: 'score',
  results: [
    {
      bank: { id: 1, name: 'Banque A' },
      score: 95,
      details: {
        account_monthly_fee: { value: 3000, score: 100 },
        card_annual_fee: { value: 15000, score: 90 }
      }
    }
  ]
}
```

---

## 6. Exercices Pratiques {#exercices}

### Semaine 1 : Familiarisation

#### Jour 1-2 : Installation et Configuration
- [ ] Installer tous les outils nécessaires
- [ ] Cloner et configurer le projet
- [ ] Lancer backend et frontend
- [ ] Tester les endpoints de base avec Postman ou curl

#### Jour 3-4 : Exploration du Code
- [ ] Lire et comprendre `server.js`
- [ ] Analyser la structure des routes
- [ ] Examiner 2-3 contrôleurs
- [ ] Comprendre la configuration Sequelize

#### Jour 5 : Frontend
- [ ] Analyser la structure des composants React
- [ ] Comprendre le système de routage
- [ ] Examiner les services API
- [ ] Tester l'interface utilisateur

### Semaine 2 : Pratique

#### Exercice 1 : Ajouter un Nouveau Champ
**Objectif :** Ajouter un champ `phone` au modèle Bank

1. **Backend :**
   ```bash
   # Créer une migration
   npx sequelize migration:generate --name add-phone-to-banks
   ```

   Modifier le fichier de migration :
   ```javascript
   module.exports = {
     up: async (queryInterface, Sequelize) => {
       await queryInterface.addColumn('banks', 'phone', {
         type: Sequelize.STRING,
         allowNull: true
       });
     },
     down: async (queryInterface, Sequelize) => {
       await queryInterface.removeColumn('banks', 'phone');
     }
   };
   ```

   ```bash
   # Exécuter la migration
   npx sequelize db:migrate
   ```

2. **Modifier le modèle Bank :**
   ```javascript
   // Dans models/Bank.js
   phone: {
     type: DataTypes.STRING,
     validate: {
       len: [10, 15]
     }
   }
   ```

3. **Frontend :**
   - Mettre à jour l'interface `Bank` dans `types/Bank.ts`
   - Ajouter le champ dans les formulaires
   - Afficher le téléphone dans la liste

#### Exercice 2 : Créer un Nouveau Endpoint
**Objectif :** Créer un endpoint pour rechercher des banques par nom

1. **Route :** `GET /api/banks/search?name=terme`
2. **Contrôleur :** Méthode `searchBanks`
3. **Service :** Utiliser Sequelize `Op.iLike`
4. **Frontend :** Créer un composant de recherche

#### Exercice 3 : Ajouter une Nouvelle Fonctionnalité
**Objectif :** Système de favoris pour les banques

1. **Backend :**
   - Créer modèle `UserFavorite`
   - Endpoints pour ajouter/supprimer des favoris
   - Endpoint pour lister les favoris

2. **Frontend :**
   - Bouton "♥" sur chaque banque
   - Page des favoris
   - Gestion de l'état global

### Tests de Validation des Connaissances

#### Quiz Technique (Réponses en fin de guide)

1. **Quelle est la différence entre `npm install` et `npm ci` ?**

2. **À quoi sert le middleware `cors` dans Express ?**

3. **Que fait la méthode `useEffect` avec un tableau vide `[]` en dépendance ?**

4. **Quelle est la différence entre `let`, `const` et `var` en JavaScript ?**

5. **À quoi servent les migrations Sequelize ?**

#### Défis Pratiques

1. **Défi 1 :** Créer un système de notation des banques par les utilisateurs
2. **Défi 2 :** Implémenter un cache Redis pour améliorer les performances
3. **Défi 3 :** Ajouter l'authentification Google OAuth

---

## Ressources Complémentaires

### Documentation Officielle
- [Node.js](https://nodejs.org/docs/)
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Sequelize](https://sequelize.org/)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Outils de Développement
- [Postman](https://www.postman.com/) : Tester les API
- [pgAdmin](https://www.pgadmin.org/) : Interface graphique PostgreSQL
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/) : Extension Chrome

### Commandes Utiles

```bash
# Backend
npm run dev          # Démarrer en mode développement
npm run lint         # Vérifier le code avec ESLint
npx sequelize db:migrate:undo  # Annuler la dernière migration

# Frontend
npm run build        # Construire pour la production
npm run preview      # Prévisualiser le build de production
npm run lint         # Vérifier le code TypeScript

# Git
git status           # Voir l'état des fichiers
git add .            # Ajouter tous les changements
git commit -m "message"  # Créer un commit
git pull origin main # Récupérer les dernières modifications
```

---

## Réponses au Quiz

1. **`npm install`** installe les dépendances et peut modifier `package-lock.json`. **`npm ci`** installe exactement ce qui est dans `package-lock.json` (plus rapide et reproductible).

2. **CORS** (Cross-Origin Resource Sharing) permet aux applications web d'accéder aux ressources d'un autre domaine, contournant la politique de même origine des navigateurs.

3. **`useEffect(() => {}, [])`** s'exécute une seule fois après le premier rendu du composant (équivalent à `componentDidMount`).

4. **`var`** : portée fonction, hoisting. **`let`** : portée bloc, pas de hoisting. **`const`** : portée bloc, pas de hoisting, non réassignable.

5. **Les migrations Sequelize** permettent de versioner et modifier la structure de la base de données de manière contrôlée et reproductible.

---

## Conclusion

Ce guide vous a fourni une base solide pour comprendre et travailler sur le projet Comparateur Bancaire. En suivant les exercices pratiques et en explorant le code, vous devriez être capable de :

- Installer et configurer l'environnement de développement
- Comprendre l'architecture backend (Node.js/Express/Sequelize)
- Comprendre l'architecture frontend (React/TypeScript)
- Naviguer dans le code et identifier les composants clés
- Effectuer des modifications simples
- Ajouter de nouvelles fonctionnalités

**Prochaines étapes suggérées :**
1. Approfondissement des concepts React (hooks, context, performance)
2. Maîtrise de TypeScript avancé
3. Tests unitaires et d'intégration
4. Optimisation des performances
5. Déploiement et DevOps

Bonne chance dans votre apprentissage !