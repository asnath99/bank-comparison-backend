const express = require('express');
const controller = require('../controllers/bankproductController');
const { validateBankProduct } = require('../middleware/validateBankProduct');
const router = express.Router();

// Routes publiques
router.get('/', controller.getAllProducts); //Récupère tous les produits bancaires (toutes banques confondues)
router.get('/search', controller.searchProducts); //Recherche parmi les produits (toutes banques confondues)
router.get('/types', controller.getProductTypes); //Récupère les types de produits (toutes banques confondues)
router.get('/bank/:bankId', controller.getProductsByBank); //Récupère tous les produits d'une banque donnée
router.get('/type/:productType', controller.getProductsByType); //Récupère tous les produits d’un certain type (toutes banques confondues)
router.get('/bank/:bankId/type/:productType', controller.getProductsByBankAndType); //Récupère les produits d'une banque et d'un type donné
router.get('/:id', controller.getProductById); //Récupère un produit bancaire précis par son ID

// Routes avec validation
router.post('/', validateBankProduct, controller.createProduct); //Crée un nouveau produit bancaire
router.put('/:id', validateBankProduct, controller.updateProduct); //Met à jour un produit existant

// Manipulation du champ `details` (JSONB)
router.post('/:id/details/add', controller.addDetailKey); //Ajoute une nouvelle clé/valeur dans le champ `details`
router.put('/:id/details/:key', controller.updateDetailKey); //Met à jour une clé spécifique dans `details`
router.delete('/:id/details/:key', controller.removeDetailKey); //Supprime une clé spécifique dans `details`
router.get('/filter/details', controller.filterProductsByDetailKey); //Filtre les produits selon une clé spécifique dans `details`

// Routes d'administration
router.delete('/:id/permanent', controller.permanentlyDeleteBankProduct); //Supprime définitivement un produit

module.exports = router;