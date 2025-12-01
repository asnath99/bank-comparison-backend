const { Bank, BankAccount, Sequelize } = require('../models');
const BaseService = require('./BaseService');
const { Op } = Sequelize; 
const { ValidationError, NotFoundError } = require('../utils/errors');
const { withActiveBank } = require('../utils/publicFilters');

class BankAccountService extends BaseService {
  constructor() {
    super(BankAccount, 'Compte bancaire');
  }

/************************ Vue publique ***************************/
 
  /**
   * [PUBLIC] Lister tous les comptes bancaires dont la banque est active
   */
    async getAllBankAccountsPublic() {
    return this.getAll({
      include: withActiveBank([{ model: Bank, attributes: ['id','name','logo_url'] }]),
      order: [['bank_id','ASC'], ['type','ASC']]
    });
  }

   /**
   * [PUBLIC] Retourne uniquement le compte si la banque est active
   */ 
  async getBankAccountByIdPublic(id) {
    return this.getById(id, {
      include: withActiveBank([{ model: Bank, attributes: ['id','name','logo_url'] }])
    });
  }

   /**
   * [PUBLIC] Lister tous les comptes d'une banque est active
   */ 

    async getAccountsByBankPublic(bankId) {
    return this.getAll({
      where: { bank_id: bankId },
      include: withActiveBank([{ model: Bank, attributes: ['id','name','logo_url'] }]),
      order: [['type','ASC']]
    });
  }

   /**
   * [PUBLIC] Retourne uniquement les compte si la banque est active
   */ 
   async searchBankAccountsPublic(term) {
    const rows = await this.getAll({
      where: {
        [Op.or]: [
          { type:  { [Op.iLike]: `%${term}%` } },
          { notes: { [Op.iLike]: `%${term}%` } },
          { '$Bank.name$': { [Op.iLike]: `%${term}%` } },
        ],
      },
      include: withActiveBank([{ model: Bank, attributes: ['id','name'] }]),
      order: [['monthly_fee','ASC']]
    });
    return rows;
  }


/************************ Vue admin ***************************/

  /**
   * [ADMIN] Lister tous les comptes bancaires
   */
  async getAllBankAccounts() {
    return await this.getAll({
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url','is_active'] 
      }],
      order: [['bank_id', 'ASC'], ['type', 'ASC']]
    });
  }

  /**
   * [ADMIN] Lister tous les comptes d'une banque
   */
  async getAccountsByBank(bankId) {
  const bank = await Bank.findByPk(bankId, { attributes: ['id', 'name', 'is_active'] });
  if (!bank) throw new NotFoundError(`Banque ${bankId} introuvable`);

  return this.getAll({
    where: { bank_id: bankId },
    order: [['type', 'ASC']],
  });
}

  /**
   * [ADMIN] Récupérer un compte par ID
   */
  async getBankAccountById(id) {
    return await this.getById(id, {
      include: [{ 
        model: Bank, 
        attributes: ['id', 'name', 'logo_url'] 
      }]
    });
  }

 
  /**
   * [ADMIN] Créer un nouveau compte bancaire
   */
async createBankAccount(accountData) {
    if (!accountData.bank_id) {
      throw new ValidationError("L'ID de la banque est requis");
    }
    if (!accountData.type || accountData.type.trim().length < 2) {
      throw new ValidationError('Le type de compte est requis');
    }

    // Vérifier que la banque existe active ou non
    await this.validateRelatedEntity(Bank, accountData.bank_id, 'La banque');
    const account = await this.create(accountData);
    await account.reload({
      include: [{ model: Bank, attributes: ['id', 'name', 'is_active'] }]
    });

    return account; 
  }


  /**
   * [ADMIN] Mettre à jour un compte bancaire
   */
  async updateBankAccount(id, updateData) {

    const oldAccount = await this.getById(id, {
      include: [{ model: Bank, attributes: ['id', 'name', 'is_active'] }]
    });
    await this.update(id, updateData);

    const newAccount = await this.getById(id, {
      include: [{ model: Bank, attributes: ['id', 'name', 'is_active'] }]
    });
    return { oldAccount, newAccount};
  }


  /**
   * [ADMIN] Rechercher des comptes
   */
  async searchBankAccounts(searchTerm) {
    // Recherche plus complexe avec jointure - on garde la logique spécifique
    return await this.getAll({
      where: {
        [Op.or]: [
          { type: { [Op.iLike]: `%${searchTerm}%` } },
          { notes: { [Op.iLike]: `%${searchTerm}%` } },
          { '$Bank.name$': { [Op.iLike]: `%${searchTerm}%` } }
        ],
      },
      include: [{
        model: Bank,
        attributes: ['id', 'name'],
        required: true 
      }],
      order: [['monthly_fee', 'ASC']]
    });
  }

  /**
   * [ADMIN] Supprimer définitivement un compte (hard delete)
   */
  async permanentlyDeleteBankAccount(id) {
    return await this.permanentlyDelete(id);
  }
}

module.exports = new BankAccountService();