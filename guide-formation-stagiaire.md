# Guide de Formation pour Stagiaire - Développement du Tableau de Bord d'Administration

## Introduction

Bienvenue dans l'équipe ! Ce document est ton guide pour les quatre prochaines semaines. Notre objectif est de développer ensemble un tableau de bord d'administration pour notre application de comparaison bancaire. Ce projet te permettra de monter en compétence sur des technologies clés comme **Node.js/Express.js** pour le backend, **React** pour le frontend, et de maîtriser les bonnes pratiques de développement professionnel, notamment l'utilisation de **Git**.

Ce guide est progressif. Ne t'inquiète pas si tout n'est pas clair au début. Chaque étape est conçue pour s'appuyer sur la précédente. N'hésite jamais à poser des questions.

**Ton environnement de travail :**
*   **OS :** Windows
*   **Éditeur de code :** Visual Studio Code
*   **Terminal :** Il est fortement recommandé d'utiliser **Git Bash**, qui est installé avec Git, ou le **Windows Subsystem for Linux (WSL)** pour avoir un environnement de commandes plus standard et éviter les problèmes de compatibilité de commandes.

---

## Semaine 1 : Prise en Main et Maîtrise de Git

**Objectif :** Se familiariser avec le projet, le flux de travail Git, et apporter une première petite contribution au code.

### Jour 1 : Configuration de l'Environnement

1.  **Clonage du projet :**
    *   Ouvre ton terminal (Git Bash).
    *   Navigue vers le dossier où tu souhaites enregistrer le projet (par exemple, `cd C:/Users/YourUser/Documents/Development`).
    *   Clone le dépôt Git du projet :
        ```bash
        git clone <URL_DU_DEPOT_GIT> bank-comparison
        cd bank-comparison
        ```

2.  **Installation des dépendances :**
    Le projet est divisé en deux parties : `frontend` et `backend`. Chacune a ses propres dépendances.
    *   **Backend :**
        ```bash
        cd backend
        npm install
        cd .. 
        ```
    *   **Frontend :**
        ```bash
        cd frontend
        npm install
        cd ..
        ```
    *   *Note :* `npm install` lit le fichier `package.json` et télécharge toutes les librairies nécessaires au projet dans un dossier `node_modules`.

3.  **Configuration de Git :**
    Assure-toi que Git est configuré avec ton nom et ton email.
    ```bash
    git config --global user.name "Ton Nom"
    git config --global user.email "ton.email@example.com"
    ```

### Jour 2 : Exploration du Code Source (Backend)

Aujourd'hui, pas de code. L'objectif est de comprendre comment le backend est structuré. Ouvre le dossier `backend` dans Visual Studio Code et explore les fichiers suivants :

*   `server.js` : C'est le point d'entrée de l'application. Regarde comment le serveur Express est créé et comment les routes sont importées et utilisées.
*   `package.json` : Liste toutes les dépendances du backend (Express, Sequelize, etc.) et les scripts (`start`, `dev`...).
*   `routes/bankRoutes.js` : Définit les "chemins" ou "URLs" (endpoints) liés aux banques. Par exemple, `GET /api/banks`. Il fait le lien entre une URL et une fonction du contrôleur.
*   `controllers/bankController.js` : Contient la logique métier. Lorsqu'un utilisateur appelle `GET /api/banks`, c'est une fonction de ce fichier qui est exécutée pour récupérer les données et renvoyer une réponse.
*   `models/bank.js` : Définit la structure des données pour une "banque" dans la base de données. C'est un modèle Sequelize, qui est un ORM (Object-Relational Mapper) pour interagir avec la base de données en utilisant du JavaScript.
*   `migrations/` : Les fichiers dans ce dossier décrivent les changements successifs de la structure de la base de données (création de tables, ajout de colonnes, etc.).

### Jour 3 : Première Fonctionnalité et Première Branche Git

**Objectif :** Ajouter un champ "numéro de téléphone" (`phoneNumber`) à une banque.

1.  **Créer une branche de développement (`develop`) :**
    Dans un vrai projet, on ne travaille jamais directement sur la branche `main`. On utilise une branche de développement.
    ```bash
    # Assure-toi d'être sur la branche main et à jour
    git checkout main
    git pull origin main

    # Crée la branche develop et pousse-la sur le serveur
    git checkout -b develop
    git push -u origin develop
    ```

2.  **Créer une branche pour ta fonctionnalité :**
    Chaque nouvelle fonctionnalité ou correction de bug se fait dans sa propre branche, à partir de `develop`.
    ```bash
    git checkout develop
    git pull origin develop # S'assurer d'être à jour
    git checkout -b feature/add-bank-phone-number
    ```
    *   `feature/` est une convention pour nommer les branches de nouvelles fonctionnalités.

3.  **Modifier le code :**
    *   **Créer une migration :** Pour ajouter la colonne `phone_number` à la table `Banks`. Utilise l'outil `sequelize-cli` (installé avec les dépendances) pour générer un nouveau fichier de migration.
        ```bash
        # Dans le dossier /backend
        npx sequelize-cli migration:generate --name add-phone-number-to-banks
        ```
        Ouvre le nouveau fichier créé dans `migrations/` et ajoute le code pour ajouter la colonne.
    *   **Mettre à jour le modèle :** Ajoute le champ `phoneNumber` dans le fichier `backend/models/bank.js` pour que Sequelize soit au courant de ce nouveau champ.
    *   **Mettre à jour le contrôleur :** Modifie la fonction d'update dans `backend/controllers/bankController.js` pour qu'elle permette de modifier ce nouveau champ.

### Jour 4 : Tester et "Commiter"

1.  **Tester ta modification :**
    Pour l'instant, nous n'avons pas de base de données configurée localement. Tu peux faire une vérification "visuelle" de ton code. Plus tard, nous utiliserons des outils comme Postman pour tester les routes API.

2.  **Faire un "commit" :**
    Un "commit" est un instantané de tes modifications. Il doit être petit et représenter une seule idée logique.
    ```bash
    # Voir les fichiers que tu as modifiés
    git status

    # Ajouter les fichiers modifiés à la "zone de transit"
    git add backend/migrations/YYYYMMDDHHMMSS-add-phone-number-to-banks.js
    git add backend/models/bank.js
    git add backend/controllers/bankController.js

    # Créer le commit avec un message descriptif
    git commit -m "feat: add phone number to banks model and controller"
    ```
    *   `feat:` est une convention (Conventional Commits) pour indiquer que c'est une nouvelle fonctionnalité.

### Jour 5 : Pousser le Code et Fusionner

1.  **Pousser ta branche :**
    Envoie tes commits sur le dépôt distant.
    ```bash
    git push -u origin feature/add-bank-phone-number
    ```

2.  **Créer une "Pull Request" (PR) :**
    *   Va sur l'interface web de votre dépôt Git (GitHub, GitLab, etc.).
    *   Tu verras une notification pour créer une "Pull Request" depuis ta branche `feature/add-bank-phone-number` vers la branche `develop`.
    *   Donne un titre clair à ta PR et une description de ce que tu as fait. C'est le moment où d'autres développeurs peuvent relire ton code et laisser des commentaires.

3.  **Fusionner ("Merge") la PR :**
    Une fois la PR approuvée, tu (ou ton manager) pourras la fusionner dans `develop`.

4.  **Mise à jour et nettoyage :**
    Une fois la branche fusionnée, tu peux la supprimer et mettre à jour ta copie locale.
    ```bash
    # Reviens sur la branche develop
    git checkout develop

    # Récupère la version la plus récente (qui inclut maintenant tes modifications)
    git pull origin develop

    # Supprime la branche de fonctionnalité qui n'est plus utile
    git branch -d feature/add-bank-phone-number
    git push origin --delete feature/add-bank-phone-number # Supprime la branche distante
    ```

**Félicitations ! Tu as terminé ton premier cycle de développement complet !**

---

## Semaines 2-4 : Développement du Tableau de Bord (Backend API)

Maintenant que tu maîtrises le flux de travail, nous allons construire l'API (la partie backend) du tableau de bord. Le frontend (React) sera développé plus tard et utilisera cette API.

Le tableau de bord doit permettre à un administrateur de :
*   Gérer les banques (Créer, Lire, Mettre à jour, Supprimer - CRUD).
*   Gérer les produits bancaires (CRUD).
*   Gérer les règles de comparaison.

### Semaine 2 : CRUD pour les Banques

**Objectif :** Créer tous les endpoints API nécessaires pour gérer les banques.

1.  **Créer une nouvelle branche :** `feature/dashboard-banks-crud` à partir de `develop`.
2.  **Sécuriser les routes :** Le tableau de bord est réservé aux administrateurs. Regarde le fichier `middleware/validateAdmin.js`. Ce "middleware" est une fonction qui vérifie si l'utilisateur est un admin avant de le laisser accéder à une route. Tu devras l'appliquer à toutes les nouvelles routes du tableau de bord.
3.  **Créer les routes (dans `routes/adminRoutes.js` ou un nouveau fichier) :**
    *   `POST /api/admin/banks` : Pour créer une nouvelle banque.
    *   `GET /api/admin/banks` : Pour lister toutes les banques (avec pagination).
    *   `GET /api/admin/banks/:id` : Pour voir les détails d'une seule banque.
    *   `PUT /api/admin/banks/:id` : Pour mettre à jour une banque.
    *   `DELETE /api/admin/banks/:id` : Pour supprimer (ou désactiver) une banque.
4.  **Implémenter la logique dans le contrôleur (`controllers/adminController.js`) :**
    *   Pour chaque route, écris la fonction correspondante.
    *   Inspire-toi de `bankController.js` mais utilise les services appropriés comme `bank.service.js` pour interagir avec la base de données.
5.  **Tester, Commiter, Pousser et Créer une PR** à la fin de la semaine.

### Semaine 3 : CRUD pour les Produits Bancaires

**Objectif :** Répéter le processus de la semaine 2, mais pour les produits (comptes, cartes, etc.).

1.  **Créer une nouvelle branche :** `feature/dashboard-products-crud` à partir de `develop`.
2.  **Analyser les modèles :** Regarde les modèles `bankaccounts.js`, `bankcards.js`, etc. Note les relations entre eux (par exemple, un produit appartient à une banque).
3.  **Créer les routes et contrôleurs :**
    *   `POST /api/admin/products`
    *   `GET /api/admin/products`
    *   ... etc.
    *   La logique sera un peu plus complexe car tu devras gérer les liens avec les banques (par exemple, s'assurer que la banque existe avant de lui associer un produit).
4.  **Tester, Commiter, Pousser et Créer une PR.**

### Semaine 4 : Gestion du Moteur de Comparaison et Finalisation

**Objectif :** Permettre à l'administrateur de modifier les règles qui déterminent les résultats de comparaison. C'est la partie la plus complexe.

1.  **Créer une nouvelle branche :** `feature/dashboard-comparison-rules` à partir de `develop`.
2.  **Explorer le moteur de comparaison :**
    *   Passe du temps à lire les fichiers dans `service/comparison/`.
    *   `ComparisonRule.js` et `ComparisonCriteria.js` sont les modèles de données pour les règles.
    *   `ComparisonEngine.js` est le cœur du système.
3.  **Créer les routes et contrôleurs :**
    *   L'objectif est de créer des endpoints API pour lister, créer, modifier et supprimer des `ComparisonRule` et des `ComparisonCriteria`.
    *   `GET /api/admin/comparison/rules`
    *   `PUT /api/admin/comparison/rules/:id`
    *   ... etc.
4.  **Documentation et Nettoyage :**
    *   Assure-toi que ton code est propre et commenté si nécessaire.
    *   Nous pourrions utiliser un outil comme Swagger ou Postman pour documenter l'API que tu as créée.
5.  **Tester, Commiter, Pousser et Créer une PR.**

---

## Conclusion

À la fin de ces quatre semaines, tu auras construit une base solide pour le backend du tableau de bord. Tu auras également acquis une expérience pratique et précieuse du cycle de vie complet du développement logiciel dans un contexte professionnel, de la gestion de version avec Git à la création d'une API RESTful.

Bienvenue encore une fois, et bon courage !
