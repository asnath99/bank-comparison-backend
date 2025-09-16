// services/bankService.js
const { Bank, BankAccount, BankCard, BankProduct, Sequelize } = require('../models');
const BaseService = require('./BaseService');
const { Op } = Sequelize; 
const { ValidationError } = require('../utils/errors');

class BankService extends BaseService {
  constructor() {
    super(Bank, 'Banque');
  }

  /**
   * Lister toutes les banques actives
   */
  async getAllBanks() {
    return await this.getAll({
      //where: { is_active: true },
      order: [['name', 'ASC']]
    });
  }

  /**
   * Récupérer une banque par ID
   */
  async getBankById(id) {
    return await this.getById(id);
  }

  /**
   * Ajouter une nouvelle banque
   */
  async createBank(bankData) {
    // Validation basique
    if (!bankData.name || bankData.name.trim().length < 2) {
      throw new ValidationError('Le nom de la banque est requis');
    }
  // Vérifier l'unicité du nom - SIMPLIFIÉ !
  await this.validateUniqueness('name', bankData.name, null, `Une banque avec le nom "${bankData.name}" existe déjà`);
  
  return await this.create(bankData);
}

  /**
   * Mettre à jour une banque
   */
  async updateBank(id, updateData) {    
    // Validation basique si le nom est modifié
    if (updateData.name) {
      if (updateData.name.trim().length < 2) {
        throw new ValidationError('Le nom de la banque doit contenir au moins 2 caractères');
      }
    // Vérifier l'unicité du nom 
    await this.validateUniqueness('name', updateData.name, null, `Une banque avec le nom "${updateData.name}" existe déjà`);
      }
      
      return await this.update(id, updateData);
  }

  /**
   * Désactiver une banque (soft delete)
   */
  async disableBank(id) {
    const bank = await this.getById(id);
    
    if (!bank.is_active) {
      throw new ValidationError('Cette banque est déjà désactivée');
    }
    
    await bank.update({ is_active: false });
  return bank;
  }

  /**
   * Réactiver une banque avec ses informations
   */
  async reactivateBank(id) {
    const bank = await this.getById(id);
    
    if (bank.is_active) {
      throw new ValidationError('Cette banque est déjà active');
    }
    
    await bank.update({ is_active: true });
  return bank;
  }

  /**
   * Récupérer une banque avec ses relations
   */
  async getBankWithRelations(id) {
    return await Bank.findByPk(id, {
      include: [
        { model: BankAccount, where: { is_active: true }, required: false },
        { model: BankCard, where: { is_active: true }, required: false },
        { model: BankProduct, where: { is_active: true }, required: false }
      ]
    });
  }

  /**
   * Rechercher des banques
   */
  async searchBanks(searchTerm) {
    return await this.getAll({
      where: {
      is_active: true,
      name: {
        [Op.iLike]: `%${searchTerm}%`  // insensible à la casse
      }
    },
      order: [['name', 'ASC']]
    });
  }

  /**
 * Supprimer définitivement une banque (hard delete)
 */
  async permanentlyDeleteBank(id) {
    return await this.permanentlyDelete(id);
  }
}


module.exports = new BankService();
