const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

// Ajouter une nouvelle carte
router.post('/cards', cardController.addCard);

// Lister toutes les cartes
router.get('/cards', cardController.listCards);

module.exports = router;
