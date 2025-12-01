const { Bank, BankProduct, Sequelize } = require('../models');
const BaseService = require('./BaseService');
const bankService = require('./bank.service');
const { Op } = Sequelize; 
const { ValidationError } = require('../utils/errors');

class BankProductService extends BaseService {
  constructor() {
    super(BankProduct, 'Produit bancaire');
  }
  /**
   * Lister toutes les produits bancaires
   */
    async getAllProducts() {
    return await this.getAll({
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url'] 
      }],
      order: [['bank_id', 'ASC'], ['product_type', 'ASC'], ['name', 'ASC']]
    });
  }

    /**
   * Lister toutes les produits d'une banque
   */
    async getProductsByBank(bankId) {
    // Vérifie si la banque existe
    await bankService.getBankById(bankId);
    // Récupère les produits liés à cette banque
    return await this.getAll({
      where: {bank_id: bankId},
      order: [['product_type', 'ASC'], ['name', 'ASC']]
    });
  }

    /**
   * Lister tous les produits d'un type donné
   */
  async getProductsByType(productType) {
    return await this.getAll({
      where: { product_type: productType },
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url'] 
      }],
      order: [['bank_id', 'ASC'], ['fees', 'ASC']]
    });
  }

  /**
   * lister les différents types de produits 
   */
  async getProductTypes() {
    const types = await BankProduct.findAll({
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('product_type')), 'product_type']],
      order: [['product_type', 'ASC']]
    });
    
    return types.map(type => type.product_type);
  }

  /**
   * Récupérer un produit par ID
   */
  async getProductById(id) {
    return await this.getById(id, {
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url'] 
      }]
    });
  }

  /**
   * Créer un nouveau produit bancaire
   */
  async createProduct(productData) {
    // Validation basique
    if (!productData.bank_id) {
      throw new ValidationError('L\'ID de la banque est requis');
    }
    
    if (!productData.product_type || productData.product_type.trim().length < 2) {
      throw new ValidationError('Le type de produit est requis (minimum 2 caractères)');
    }

    if (!productData.name || productData.name.trim().length < 2) {
      throw new ValidationError('Le nom du produit est requis (minimum 2 caractères)');
    }

    // Vérifier que la banque existe
    await this.validateRelatedEntity(Bank, productData.bank_id, 'La banque');

    return await this.create(productData);
  }

  /**
   * Mettre à jour un produit bancaire
   */
  async updateBankProduct(id, updateData) {
    // Validation si bank_id est modifié
    if (updateData.bank_id) {
      await this.validateRelatedEntity(Bank, updateData.bank_id, 'La banque');
    }
    
    return await this.update(id, updateData);
  }

  /**
   * Rechercher des produits
   */
  async searchProducts(searchTerm) {
    return await this.getAll({
    where: {
      [Op.or]: [
        { name: { [Op.iLike]: `%${searchTerm}%` } },
        { product_type: { [Op.iLike]: `%${searchTerm}%` } },
        { '$Bank.name$': { [Op.iLike]: `%${searchTerm}%` } }
      ],
    },
    include: [{
      model: Bank,
        attributes: ['id', 'name', 'logo_url'],
        required: true 
    }],
      order: [['fees', 'ASC']]
  });
}


  /**
   * Supprimer définitivement un produit (hard delete)
   */
  async permanentlyDeleteProduct(id) {
    return await this.permanentlyDelete(id);
 }




  /**
   * Ajouter une propriété dans le champ details JSONB
   */
  async addDetailKey(productId, key, value) {
  const product = await this.getProductById(productId);

  // Récupère les détails actuels ou initialise un objet vide
  const currentDetails = product.details || {};
  
  // Crée un nouvel objet dans lequel on copie les anciennes valeur de détail auxquels on ajoute la nouvelle clé
  const newDetails = { ...currentDetails, [key]: value };
  
  // Met à jour le produit
  // await product.update({ details: newDetails });
  
  // return product;
  return await this.update(productId, { details: newDetails });
}


  /**
   * Modifier une propriété précise dans le champ details JSONB
   */
    async updateDetailKey(productId, key, value) {
      const product = await this.getProductById(productId);
      const currentDetails = product.details || {};

      // Vérifie l'existence de la clé sans violer no-prototype-builtins
      if (!Object.prototype.hasOwnProperty.call(currentDetails, key)) {
        throw new ValidationError(`La propriété '${key}' n'existe pas dans les détails`);
      }

      // Clone + update
      const newDetails = { ...currentDetails, [key]: value };

      return await this.update(productId, { details: newDetails });
    }

  /**
   * Rechercher les produits avec un details.key = value
   */
  async filterProductsByDetailKey(key, value) {
    return await this.getAll({
      where: {
        details: {
          [key]: value
        }
      },
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url'] 
      }],
      order: [['bank_id', 'ASC'], ['name', 'ASC']]
    });
  }

  /**
   * Obtenir les produits d'une banque filtrés par type
   */
  async getProductsByBankAndType(bankId, productType) {
    // Vérifie si la banque existe
    await bankService.getBankById(bankId);

    return await this.getAll({
      where: {
        bank_id: bankId,
        product_type: productType
      },
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url'] 
      }],
      order: [['fees', 'ASC'], ['name', 'ASC']]
    });
  }


  /**
   * Supprimer une propriété dans le champ details JSONB
   */
  async removeDetailKey(productId, key) {
    const product = await this.getProductById(productId);
    const currentDetails = product.details || {};

    if (!Object.prototype.hasOwnProperty.call(currentDetails, key)) {
      throw new ValidationError(`La propriété '${key}' n'existe pas dans les détails`);
    }

    const newDetails = { ...currentDetails };
    delete newDetails[key];

    return await this.update(productId, { details: newDetails });
  }

}


module.exports = new BankProductService();
