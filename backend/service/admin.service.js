// services/admin/AdminService.js
const { AdminUser } = require('../models');
const BaseService = require('./BaseService');
const { ValidationError } = require('../utils/errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AdminService extends BaseService {
  constructor() {
    super(AdminUser, 'Utilisateur admin');
  }

  /**
   * Créer un nouvel utilisateur admin
   */
  async createAdmin(adminData) {
    if (!adminData.email || !adminData.email.trim()) {
      throw new ValidationError('L\'email est requis');
    }
    if (!adminData.password || adminData.password.length < 6) {
      throw new ValidationError('Le mot de passe doit contenir au moins 6 caractères');
    }
    if (!['admin', 'super-admin'].includes(adminData.role)) {
      throw new ValidationError('Le rôle doit être "admin" ou "super-admin"');
    }

    await this.validateUniqueness('email', adminData.email, null, `Un utilisateur avec l'email "${adminData.email}" existe déjà`);
    const password_hash = await bcrypt.hash(adminData.password, 10);
    return await this.create({
      email: adminData.email,
      password_hash,
      role: adminData.role || 'admin',
      is_active: true // Par défaut, les nouveaux admins sont actifs
    });
  }

  /**
   * Authentifier un utilisateur admin
   */
  async login(email, password) {
    const user = await AdminUser.findOne({ where: { email }, is_active: true });
    if (!user) throw new ValidationError('Utilisateur non trouvé');
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw new ValidationError('Mot de passe incorrect');
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'my-secret-key', { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, role: user.role } };
  }

  /**
   * Vérifier un token JWT
   */
  verifyToken(token) {
    return jwt.verify(token, 'my-secret-key');
  }

  /**
   * Récupérer un utilisateur admin par ID
   */
  async getAdminById(id) {
    return await this.getById(id);
  }

  /**
   * Lister tous les utilisateurs admin
   */
  async getAllAdmins() {
    return await this.getAll({
      where: { is_active: true },
      order: [['email', 'ASC']]
    });
  }

  /**
   * Mettre à jour un utilisateur admin
   */
  async updateAdmin(id, updateData) {
    if (updateData.email) {
      if (!updateData.email.trim()) {
        throw new ValidationError('L\'email ne peut pas être vide');
      }
      await this.validateUniqueness('email', updateData.email, id, `Un utilisateur avec l'email "${updateData.email}" existe déjà`);
    }
    if (updateData.password) {
      if (updateData.password.length < 6) {
        throw new ValidationError('Le mot de passe doit contenir au moins 6 caractères');
      }
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
    if (updateData.role && !['admin', 'super-admin'].includes(updateData.role)) {
      throw new ValidationError('Le rôle doit être "admin" ou "super-admin"');
    }
    return await this.update(id, updateData);
  }

  /**
   * Désactiver un admin (soft delete)
   */
  async disableAdmin(id) {
    const admin = await this.getById(id);
    if (!admin.is_active) {
      throw new ValidationError('Cet administrateur est déjà désactivé');
    }
    await admin.update({ is_active: false });
    return admin;
  }

    /**
   * Réactiver un admin avec ses informations
   */
  async reactivateAdmin(id) {
    const admin = await this.getById(id);
    if (admin.is_active) {
      throw new ValidationError('Cet administrateur est déjà actif');
    }
    await admin.update({ is_active: true });
  return admin;
  }

    /**
 * Supprimer définitivement un admin (hard delete)
 */
  async permanentlyDeleteAdmin(id) {
    return await this.permanentlyDelete(id);
  }
}

module.exports = new AdminService();