const { Bank, BankCard, Sequelize } = require('../models');
const BaseService = require('./BaseService');
const { Op } = Sequelize; 
const { ValidationError, NotFoundError } = require('../utils/errors');
const { withActiveBank } = require('../utils/publicFilters');

class BankCardService extends BaseService {
  constructor() {
    super(BankCard, 'Carte bancaire');
  }

/************************ Vue publique ***************************/

  /**
   * [PUBLIC] Lister toutes les cartes bancaires dont la banque est active
   */
    async getAllBankCardsPublic() {
    return this.getAll({
      include: withActiveBank([{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url']  
      }]),
      order: [['bank_id', 'ASC'], ['card_type', 'ASC']]
    });
  }

  /**
   * [PUBLIC] Lister toutes les cartes d'une banque active
   */
    async getCardsByBankPublic(bankId) {
    return this.getAll({
      where: {bank_id: bankId},
      include: withActiveBank([{ model: Bank, attributes: ['id','name','logo_url'] }]),
      order: [['card_type', 'ASC']]
    });
  }

  /**
   * [PUBLIC] Retourne uniquement la carte si la banque est active
   */
  async getCardByIdPublic(id) {
    return this.getById(id, {
      include: withActiveBank([{ 
        model: Bank, 
        attributes: ['id','name','logo_url'] 
      }])
    });
  }

  /**
   * [PUBLIC] Retourne uniquement les cartes si la banque est active
   */
  async searchBankCardsPublic(searchTerm) {
    const rows = await this.getAll({
      where: {
      [Op.or]: [
        { card_type: { [Op.iLike]: `%${searchTerm}%` } },
        { notes: { [Op.iLike]: `%${searchTerm}%` } },
        { '$Bank.name$': { [Op.iLike]: `%${searchTerm}%` } }
      ],
    },
    include: withActiveBank([{ 
      model: Bank, 
      attributes: ['id','name'] 
    }]),

    order: [['card_type', 'ASC']]
  });
  return rows;
}

/************************ Vue admin ***************************/

  /**
   * [ADMIN] Lister toutes les cartes bancaires
   */
    async getAllBankCards() {
    return await this.getAll({
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url','is_active']  
      }],
      order: [['bank_id', 'ASC'], ['card_type', 'ASC']]
    });
  }

    /**
   * [ADMIN] Lister toutes les cartes d'une banque
   */
    async getCardsByBank(bankId) {
    const bank = await Bank.findByPk(bankId, { attributes: ['id', 'name', 'is_active'] });
    if (!bank) throw new NotFoundError(`Banque ${bankId} introuvable`);

    return this.getAll({
      where: {bank_id: bankId},
      order: [['card_type', 'ASC']]
    });
  }

  /**
   * [ADMIN] Récupérer une carte par ID
   */
  async getCardById(id) {
    return await this.getById(id, {
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url'] 
      }]
    });
  }

  /**
   * [ADMIN] Créer une nouvelle carte
   */
  async createBankCard(cardData) {
    // Validation basique
    if (!cardData.bank_id) {
      throw new ValidationError('L\'ID de la banque est requis');
    }
    if (!cardData.card_type  || cardData.card_type .trim().length < 2) {
      throw new ValidationError('Le type de la carte est requis');
    }
    
    // Vérifier que la banque existe active ou non
    await this.validateRelatedEntity(Bank, cardData.bank_id, 'La banque');

    const card = await this.create(cardData);
    await card.reload({
      include: [{ model: Bank, attributes: ['id', 'name', 'is_active'] }]
    });

    return card;
  }

  /**
   * [ADMIN] Mettre à jour une carte
   */
  async updateBankCard(id, updateData) {

    const oldCard = await this.getById(id, {
      include: [{ model: Bank, attributes: ['id', 'name', 'is_active'] }]
    });
    await this.update(id, updateData);

    const newCard = await this.getById(id, {
      include: [{ model: Bank, attributes: ['id', 'name', 'is_active'] }]
    });
    return { oldCard, newCard};
  }


  /**
   * [ADMIN] Rechercher des cartes
   */
  async searchBankCards(searchTerm) {
    return await this.getAll({
      where: {
      [Op.or]: [
        { card_type: { [Op.iLike]: `%${searchTerm}%` } },
        { notes: { [Op.iLike]: `%${searchTerm}%` } },
        { '$Bank.name$': { [Op.iLike]: `%${searchTerm}%` } }
      ],
    },
    include: [{
      model: Bank,
      attributes: ['id', 'name'],
      required: true 
    }],
    order: [['card_type', 'ASC']]
  });
}


  /**
 * [ADMIN] Supprimer définitivement une carte (hard delete)
 */
  async permanentlyDeleteBankCard(id) {
    return await this.permanentlyDelete(id);
  }
}


module.exports = new BankCardService();
