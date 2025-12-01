const bankProductService = require('../service/bankproduct.service');
const { handleError } = require('../utils/errorHandler');

/**
 * Lister toutes les produits bancaires
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await bankProductService.getAllProducts();
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Lister tous les produits d'une banque
 */
const getProductsByBank = async (req, res) => {
  try {
    const bankId = req.params.bankId;
    const products = await bankProductService.getProductsByBank(bankId);
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
};

/**
 * Lister tous les produits d'un type donné
 */
const getProductsByType = async (req, res) => {
  try {
    const productType = req.params.productType;
    const products = await bankProductService.getProductsByType(productType);
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
};


/**
 * Lister tous les types de produits
 */
const getProductTypes = async (req, res) => {
  try {
    const types = await bankProductService.getProductTypes();
    res.status(200).json({
      success: true,
      data: types,
      count: types.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.toString()
    });
  }
};


/**
 * Récupérer un produit par son ID
 */
const getProductById = async (req, res) => {
  try {
    const product = await bankProductService.getProductById(req.params.id);
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Créer un produit
 */
const createProduct = async (req, res) => {
  try {
    const product = await bankProductService.createProduct(req.body);
    res.status(201).json({
      success: true,
      message: 'Produit crée avec succès',
      data: product
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Modifier un produit
 */
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await bankProductService.updateBankProduct(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Produit modifiée avec succès',
      data: updatedProduct
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Rechercher des produits
 */
const searchProducts = async (req, res) => {
  try {
    const searchTerm = req.query.query || req.query.term || req.query.search || '';
    
    if (searchTerm.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Le terme de recherche doit contenir au moins 2 caractères'
      });
    }
    
    const products = await bankProductService.searchProducts(searchTerm.trim());
    res.status(200).json({
      success: true,
      data: products,
      count: products.length,
      searchTerm
    });
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Supprimer définitivement un produit (hard delete)
 */
const permanentlyDeleteBankProduct = async (req, res) => {
  try {
    const result = await bankProductService.permanentlyDeleteProduct(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Ajouter une propriété dans le champ details d'un produit
 */
const addDetailKey = async (req, res) => {
  try {
    const { key, value } = req.body;
    
    if (!key || key.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'La clé est requise'
      });
    }

    const product = await bankProductService.addDetailKey(req.params.id, key.trim(), value);
    res.status(200).json({
      success: true,
      message: `Propriété '${key}' ajoutée avec succès`,
      data: product
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Modifier une propriété existante dans le champ details
 */
const updateDetailKey = async (req, res) => {
  try {
    const { key } = req.params;  // Clé depuis l'URL
    const { value } = req.body;  // Valeur depuis le body

    const product = await bankProductService.updateDetailKey(req.params.id, key, value);
    res.status(200).json({
      success: true,
      message: `Propriété '${key}' mise à jour avec succès`,
      data: product
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Supprimer une propriété du champ details
 */
const removeDetailKey = async (req, res) => {
  try {
    const { key } = req.params;

    const product = await bankProductService.removeDetailKey(req.params.id, key);
    res.status(200).json({
      success: true,
      message: `Propriété '${key}' supprimée avec succès`,
      data: product
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Rechercher des produits par une propriété spécifique dans details
 */
const filterProductsByDetailKey = async (req, res) => {
  try {
    const { key, value } = req.query;

    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre "key" est requis'
      });
    }

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Le paramètre "value" est requis'
      });
    }

    const products = await bankProductService.filterProductsByDetailKey(key, value);
    res.status(200).json({
      success: true,
      message: `${products.length} produit(s) trouvé(s) avec ${key} = ${value}`,
      data: products
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Obtenir les produits d'une banque filtrés par type
 */
const getProductsByBankAndType = async (req, res) => {
  try {
    const { bankId, productType } = req.params;

    const products = await bankProductService.getProductsByBankAndType(bankId, productType);
    res.status(200).json({
      success: true,
      message: `${products.length} produit(s) de type "${productType}" trouvé(s) pour cette banque`,
      data: products
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  getAllProducts,
  getProductsByBank,
  getProductsByType,
  getProductTypes,
  getProductById,
  createProduct,
  updateProduct,
  searchProducts,
  permanentlyDeleteBankProduct,
  addDetailKey,
  updateDetailKey,
  removeDetailKey,
  filterProductsByDetailKey,
  getProductsByBankAndType
};

