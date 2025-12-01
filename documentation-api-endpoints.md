# Documentation de l'API - Comparateur Bancaire

Ce document détaille l'ensemble des endpoints de l'API backend du projet Comparateur Bancaire. Il a été généré automatiquement pour servir de référence technique dans le cadre du rapport de stage.

## 1. Configuration Technique

L'API est construite sur une stack Node.js et s'appuie sur les technologies suivantes :

- **Framework Backend :** Express.js (`^5.1.0`)
- **ORM (Object-Relational Mapping) :** Sequelize (`^6.37.7`)
- **Base de données :** PostgreSQL (via le driver `pg`)
- **Authentification :** JWT (JSON Web Tokens) avec le package `jsonwebtoken`
- **Validation :** `express-validator` pour la validation des données entrantes.
- **Gestion des migrations/seeders :** `sequelize-cli`

## 2. Modèles de Données (Sequelize)

Voici la liste des modèles de données utilisés par l'application, avec leurs attributs principaux.

### AdminUser
Représente un utilisateur administrateur du back-office.

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `email` | `STRING` | Adresse email de l'utilisateur (unique) |
| `password_hash` | `STRING` | Hash du mot de passe |
| `role` | `STRING` | Rôle de l'utilisateur (`admin` ou `super-admin`) |
| `is_active` | `BOOLEAN` | Indique si le compte est actif (défaut: `true`) |

### AdminLog
Journalise les actions effectuées par les administrateurs.

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `admin_id` | `INTEGER` | Clé étrangère vers `AdminUser` |
| `action` | `STRING` | Type d'action effectuée (ex: `login`, `create_bank`) |
| `timestamp` | `DATE` | Date et heure de l'action |
| `details` | `TEXT` | Informations supplémentaires sur l'action (contexte) |

### Bank
Représente une institution bancaire.

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `name` | `STRING` | Nom de la banque |
| `logo_url` | `STRING` | URL du logo de la banque |
| `description` | `TEXT` | Description de la banque |
| `is_active` | `BOOLEAN` | Indique si la banque est active (défaut: `true`) |

### BankAccount
Représente un type de compte bancaire offert par une banque.

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `bank_id` | `INTEGER` | Clé étrangère vers `Bank` |
| `type` | `STRING` | Type de compte (ex: "Compte Courant Jeune") |
| `monthly_fee` | `DECIMAL` | Frais de tenue de compte mensuels |
| `monthly_fee_is_ttc`| `BOOLEAN` | Indique si les frais sont TTC |
| `has_variable_fees`| `BOOLEAN` | Indique si des frais variables s'appliquent |
| `variable_fee_rules`| `JSON` | Règles de calcul des frais variables |
| `currency` | `STRING` | Devise du compte (défaut: 'F CFA') |
| `notes` | `TEXT` | Notes additionnelles |

### BankCard
Représente une carte bancaire offerte par une banque.

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `bank_id` | `INTEGER` | Clé étrangère vers `Bank` |
| `card_type` | `STRING` | Type de carte (ex: "Visa Classic", "Mastercard Gold") |
| `fee` | `DECIMAL` | Frais de la carte |
| `fee_is_ttc` | `BOOLEAN` | Indique si les frais sont TTC |
| `frequency` | `ENUM` | Fréquence des frais (`an` ou `mois`) |
| `notes` | `TEXT` | Notes additionnelles |

### BankProduct
Représente un produit ou service divers offert par une banque (ex: assurance, crédit).

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `bank_id` | `INTEGER` | Clé étrangère vers `Bank` |
| `product_type` | `STRING` | Catégorie du produit (ex: "Assurance Vie") |
| `name` | `STRING` | Nom spécifique du produit |
| `details` | `JSONB` | Objet JSON contenant les détails spécifiques du produit |
| `fees` | `DECIMAL` | Frais associés au produit |

### ComparisonCriteria
Définit un critère utilisé pour la comparaison des produits.

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `key` | `STRING` | Clé unique pour le critère (ex: `card_annual_fee`) |
| `label` | `STRING` | Nom lisible du critère (ex: "Frais annuels de la carte") |
| `data_mapping` | `JSONB` | Comment mapper ce critère aux données des modèles |
| `scoring_strategy`| `STRING` | Stratégie de notation (ex: `lower_better`) |
| `is_active` | `BOOLEAN` | Indique si le critère est actif |

### ComparisonRule
Définit une règle de notation pour le moteur de comparaison.

| Attribut | Type | Description |
| --- | --- | --- |
| `id` | `INTEGER` | Identifiant unique (clé primaire) |
| `criteria_key` | `STRING` | Clé du critère auquel cette règle s'applique |
| `rule_definition`| `JSONB` | Définition de la règle au format `json-rules-engine` |
| `priority` | `INTEGER` | Ordre d'exécution de la règle |
| `is_active` | `BOOLEAN` | Indique si la règle est active |

---

## 3. Endpoints de l'API

Les endpoints sont organisés par ressource.

### Tableau Récapitulatif

| Méthode | Route | Ressource | Description courte | Accès |
| --- | --- | --- | --- | --- |
| `POST` | `/api/admin/login` | Admin | Connexion d'un administrateur | Public |
| `POST` | `/api/admin/users` | Admin | Créer un nouvel administrateur | Super Admin |
| `GET` | `/api/admin/users` | Admin | Lister tous les administrateurs | Admin |
| `GET` | `/api/admin/users/:id` | Admin | Obtenir un administrateur par ID | Admin |
| `PUT` | `/api/admin/users/:id` | Admin | Mettre à jour un administrateur | Admin/Super Admin |
| `DELETE`| `/api/admin/users/:id` | Admin | Désactiver un administrateur | Super Admin |
| `PATCH` | `/api/admin/users/:id/reactivate` | Admin | Réactiver un administrateur | Super Admin |
| `DELETE`| `/api/admin/users/:id/permanent` | Admin | Supprimer définitivement un admin | Super Admin |
| `GET` | `/api/admin/logs` | Admin | Consulter les logs d'activité | Admin |
| `GET` | `/api/banks` | Banques | Lister toutes les banques actives | Public |
| `GET` | `/api/banks/search` | Banques | Rechercher des banques | Public |
| `GET` | `/api/banks/:id` | Banques | Obtenir une banque par ID | Public |
| `POST` | `/api/banks` | Banques | Créer une nouvelle banque | Admin |
| `PUT` | `/api/banks/:id` | Banques | Mettre à jour une banque | Admin |
| `DELETE`| `/api/banks/:id` | Banques | Désactiver une banque | Admin |
| `PATCH` | `/api/banks/:id/reactivate` | Banques | Réactiver une banque | Admin |
| `DELETE`| `/api/banks/:id/permanent` | Banques | Supprimer définitivement une banque | Super Admin |
| `GET` | `/api/bankaccounts/bank-accounts` | Comptes | Lister tous les comptes (public) | Public |
| `GET` | `/api/bankaccounts/banks/:bankId/bank-accounts` | Comptes | Lister les comptes d'une banque (public) | Public |
| `GET` | `/api/bankaccounts/bank-accounts/search` | Comptes | Rechercher des comptes (public) | Public |
| `GET` | `/api/bankaccounts/bank-accounts/:id` | Comptes | Obtenir un compte par ID (public) | Public |
| `POST` | `/api/bankaccounts` | Comptes | Créer un nouveau compte | Admin |
| `PUT` | `/api/bankaccounts/:id` | Comptes | Mettre à jour un compte | Admin |
| `DELETE`| `/api/bankaccounts/:id/permanent` | Comptes | Supprimer définitivement un compte | Super Admin |
| `GET` | `/api/bankcards/bank-cards` | Cartes | Lister toutes les cartes (public) | Public |
| `GET` | `/api/bankcards/banks/:bankId/bank-cards` | Cartes | Lister les cartes d'une banque (public) | Public |
| `GET` | `/api/bankcards/bank-cards/search` | Cartes | Rechercher des cartes (public) | Public |
| `GET` | `/api/bankcards/bank-cards/:id` | Cartes | Obtenir une carte par ID (public) | Public |
| `POST` | `/api/bankcards` | Cartes | Créer une nouvelle carte | Admin |
| `PUT` | `/api/bankcards/:id` | Cartes | Mettre à jour une carte | Admin |
| `DELETE`| `/api/bankcards/:id/permanent` | Cartes | Supprimer définitivement une carte | Super Admin |
| `GET` | `/api/bankproducts` | Produits | Lister tous les produits | Public |
| `GET` | `/api/bankproducts/search` | Produits | Rechercher des produits | Public |
| `GET` | `/api/bankproducts/types` | Produits | Lister tous les types de produits | Public |
| `GET` | `/api/bankproducts/bank/:bankId` | Produits | Lister les produits d'une banque | Public |
| `GET` | `/api/bankproducts/:id` | Produits | Obtenir un produit par ID | Public |
| `POST` | `/api/bankproducts` | Produits | Créer un nouveau produit | Admin |
| `PUT` | `/api/bankproducts/:id` | Produits | Mettre à jour un produit | Admin |
| `DELETE`| `/api/bankproducts/:id/permanent` | Produits | Supprimer définitivement un produit | Admin |
| `POST` | `/api/comparison` | Comparaison | Lancer une comparaison de produits | Public |

---

### Ressource : Administration (`/api/admin`)

#### `POST /api/admin/login`
- **Description :** Authentifie un utilisateur administrateur et retourne un token JWT.
- **Fichier Source :** `backend/controllers/adminController.js` (fonction `login`)
- **Modèles Sequelize :** `AdminUser`, `AdminLog`
- **Middlewares :** `validateAdmin` (valide `email` et `password`).
- **Paramètres (Body) :**
  ```json
  {
    "email": "admin@example.com",
    "password": "your_password"
  }
  ```
- **Réponse Succès (200 OK) :**
  ```json
  {
    "success": true,
    "message": "Connexion réussie",
    "data": {
      "user": { "id": 1, "email": "...", "role": "..." },
      "token": "ey..."
    }
  }
  ```

#### `POST /api/admin/users`
- **Description :** Crée un nouvel utilisateur administrateur.
- **Fichier Source :** `backend/controllers/adminController.js` (fonction `createAdmin`)
- **Modèles Sequelize :** `AdminUser`, `AdminLog`
- **Middlewares :** `requireAdmin` (authentification), `authorizeRoles(['super-admin'])`, `validateAdmin`.
- **Paramètres (Body) :**
  ```json
  {
    "email": "new.admin@example.com",
    "password": "secure_password",
    "role": "admin"
  }
  ```
- **Réponse Succès (201 Created) :**
  ```json
  {
    "success": true,
    "message": "Utilisateur admin créé avec succès",
    "data": { "id": 2, "email": "...", "role": "admin", ... }
  }
  ```

---

### Ressource : Banques (`/api/banks`)

#### `GET /api/banks`
- **Description :** Récupère la liste de toutes les banques actives.
- **Fichier Source :** `backend/controllers/bankController.js` (fonction `getAllBanks`)
- **Modèles Sequelize :** `Bank`
- **Middlewares :** Aucun
- **Paramètres :** Aucun
- **Réponse Succès (200 OK) :**
  ```json
  {
    "success": true,
    "data": [ { "id": 1, "name": "...", ... } ],
    "count": 1
  }
  ```

#### `POST /api/banks`
- **Description :** Crée une nouvelle banque.
- **Fichier Source :** `backend/controllers/bankController.js` (fonction `createBank`)
- **Modèles Sequelize :** `Bank`, `AdminLog`
- **Middlewares :** `requireAdmin`, `authorizeRoles(['admin', 'super-admin'])`, `validateBank`.
- **Paramètres (Body) :**
  ```json
  {
    "name": "Nouvelle Banque",
    "logo_url": "http://example.com/logo.png",
    "description": "Description de la banque."
  }
  ```
- **Réponse Succès (201 Created) :**
  ```json
  {
    "success": true,
    "message": "Banque créée avec succès",
    "data": { "id": 2, "name": "Nouvelle Banque", ... }
  }
  ```

... (et ainsi de suite pour tous les autres endpoints)

---

### Ressource : Comptes Bancaires (`/api/bankaccounts`)

#### `GET /api/bankaccounts/bank-accounts`
- **Description :** (Vue publique) Récupère la liste de tous les comptes bancaires.
- **Fichier Source :** `backend/controllers/bankaccountController.js` (fonction `getAllBankAccountsPublic`)
- **Modèles Sequelize :** `BankAccount`
- **Middlewares :** Aucun
- **Paramètres :** Aucun
- **Réponse Succès (200 OK) :**
  ```json
  {
    "success": true,
    "data": [ { "id": 1, "type": "...", "monthly_fee": "10.00", ... } ],
    "count": 1
  }
  ```

#### `POST /api/bankaccounts`
- **Description :** (Admin) Crée un nouveau compte bancaire associé à une banque.
- **Fichier Source :** `backend/controllers/bankaccountController.js` (fonction `createBankAccount`)
- **Modèles Sequelize :** `BankAccount`, `AdminLog`
- **Middlewares :** `requireAdmin`, `authorizeRoles(['admin', 'super-admin'])`, `validateBankAccount`.
- **Paramètres (Body) :**
  ```json
  {
    "bank_id": 1,
    "type": "Compte Épargne",
    "monthly_fee": 0,
    "currency": "XOF"
  }
  ```
- **Réponse Succès (201 Created) :**
  ```json
  {
    "success": true,
    "message": "Compte crée avec succès",
    "data": { "id": 3, "type": "Compte Épargne", ... }
  }
  ```

---

### Ressource : Cartes Bancaires (`/api/bankcards`)

#### `GET /api/bankcards/bank-cards`
- **Description :** (Vue publique) Récupère la liste de toutes les cartes bancaires.
- **Fichier Source :** `backend/controllers/bankcardController.js` (fonction `getAllBankCardsPublic`)
- **Modèles Sequelize :** `BankCard`
- **Middlewares :** Aucun
- **Paramètres :** Aucun
- **Réponse Succès (200 OK) :**
  ```json
  {
    "success": true,
    "data": [ { "id": 1, "card_type": "Visa Classic", "fee": "15000.00", "frequency": "an", ... } ],
    "count": 1
  }
  ```

#### `POST /api/bankcards`
- **Description :** (Admin) Crée une nouvelle carte bancaire.
- **Fichier Source :** `backend/controllers/bankcardController.js` (fonction `createBankCard`)
- **Modèles Sequelize :** `BankCard`, `AdminLog`
- **Middlewares :** `requireAdmin`, `authorizeRoles(['admin', 'super-admin'])`, `validateBankCard`.
- **Paramètres (Body) :**
  ```json
  {
    "bank_id": 1,
    "card_type": "Mastercard Gold",
    "fee": 50000,
    "frequency": "an"
  }
  ```
- **Réponse Succès (201 Created) :**
  ```json
  {
    "success": true,
    "message": "Carte crée avec succès",
    "data": { "id": 2, "card_type": "Mastercard Gold", ... }
  }
  ```

---

### Ressource : Produits Bancaires (`/api/bankproducts`)

#### `GET /api/bankproducts`
- **Description :** Récupère tous les produits bancaires de toutes les banques.
- **Fichier Source :** `backend/controllers/bankproductController.js` (fonction `getAllProducts`)
- **Modèles Sequelize :** `BankProduct`
- **Middlewares :** Aucun
- **Paramètres :** Aucun
- **Réponse Succès (200 OK) :**
  ```json
  {
    "success": true,
    "data": [ { "id": 1, "product_type": "Assurance", "name": "Assurance Voyage", ... } ],
    "count": 1
  }
  ```

#### `POST /api/bankproducts`
- **Description :** Crée un nouveau produit bancaire.
- **Fichier Source :** `backend/controllers/bankproductController.js` (fonction `createProduct`)
- **Modèles Sequelize :** `BankProduct`
- **Middlewares :** `validateBankProduct`
- **Paramètres (Body) :**
  ```json
  {
    "bank_id": 1,
    "product_type": "Crédit",
    "name": "Crédit Immobilier",
    "details": { "taux": "5.5%", "duree_max": "20 ans" }
  }
  ```
- **Réponse Succès (201 Created) :**
  ```json
  {
    "success": true,
    "message": "Produit crée avec succès",
    "data": { "id": 4, "name": "Crédit Immobilier", ... }
  }
  ```

---

### Ressource : Comparaison (`/api/comparison`)

#### `POST /api/comparison`
- **Description :** Lance le moteur de comparaison en fonction des critères, filtres et budgets fournis.
- **Fichier Source :** `backend/controllers/ComparisonController.js` (fonction `compare`)
- **Modèles Sequelize :** `ComparisonCriteria`, `ComparisonRule`, `Bank`, `BankAccount`, `BankCard`, `BankProduct`
- **Middlewares :** Aucun
- **Paramètres (Body) :**
  ```json
  {
    "criteria": ["card_annual_fee", "account_monthly_fee"],
    "bankIds": [1, 2, 5],
    "mode": "score",
    "budgets": {
      "card_annual_fee": 20000
    }
  }
  ```
- **Réponse Succès (200 OK) :** La structure de la réponse dépend du `mode` (`score` ou `plain`) et des résultats de la comparaison.
  ```json
  {
    "mode": "score",
    "results": [
      {
        "bank": { "id": 1, "name": "..." },
        "score": 95,
        "details": { ... }
      }
    ],
    ...
  }
  ```
