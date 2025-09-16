// services/BaseService.js
const { Sequelize } = require('../models');
const { Op } = Sequelize;
const { ValidationError, NotFoundError } = require('../utils/errors');

class BaseService {
  constructor(model, modelName) {
    this.model = model;
    this.modelName = modelName; // Pour les messages d'erreur (ex: "Compte bancaire", "Banque")
  }

  /**
   * Lister tous les éléments avec inclusions optionnelles
   */
  async getAll(options = {}) {
    const { include = [], order = [['id', 'ASC']], where = {} } = options;
    
    return await this.model.findAll({
      where,
      include,
      order
    });
  }

  /**
   * Récupérer un élément par ID
   */
  async getById(id, options = {}) {
    const { include = [] } = options;
    
    const item = await this.model.findByPk(id, { include });
    
    if (!item) {
      throw new NotFoundError(`${this.modelName} avec l'ID ${id} introuvable`);
    }
    
    return item;
  }

  /**
   * Créer un nouvel élément
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Mettre à jour un élément
   */
  async update(id, updateData) {
    const item = await this.getById(id);
    await item.update(updateData);
    return item;
  }

  /**
   * Supprimer définitivement un élément (hard delete)
   */
  async permanentlyDelete(id, { transaction } = {}) {
    const instance = await this.model.findByPk(id, { transaction });
    if (!instance) throw new ValidationError(`${this.modelName} ${id} introuvable`);

    // Snapshot avant suppression pour récupérer la banque supprimée pour log
    const data = instance.get({ plain: true });

    await instance.destroy({ transaction });

    return data;
  }

  /**
   * Rechercher des éléments avec terme de recherche
   */
  async search(searchTerm, searchFields = [], options = {}) {
    const { include = [], order = [['id', 'ASC']] } = options;
    
    const whereConditions = searchFields.map(field => ({
      [field]: { [Op.iLike]: `%${searchTerm}%` }
    }));

    return await this.model.findAll({
      where: {
        [Op.or]: whereConditions
      },
      include,
      order
    });
  }

  /**
   * Vérifier qu'un élément lié existe (helper pour les validations FK)
   */
  async validateRelatedEntity(relatedModel, relatedId, relationName) {
    if (!relatedId) return;
    
    const relatedItem = await relatedModel.findByPk(relatedId);
    if (!relatedItem) {
      throw new ValidationError(`${relationName} spécifié n'existe pas`);
    }
  }
  
  /**
   * Vérifier l'unicité d'un champ
   */
  async validateUniqueness(field, value, excludeId = null, customMessage = null) {
    if (!value) return;
    
    const where = { [field]: value };
    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }
    
    const existing = await this.model.findOne({ where });
    if (existing) {
      const message = customMessage || `Un(e) ${this.modelName.toLowerCase()} avec le ${field} "${value}" existe déjà`;
      throw new ValidationError(message);
    }
  }
}

module.exports = BaseService;