const adminService = require('../service/admin.service');
const adminLogService = require('../service/adminlog.service');
const { ValidationError } = require('../utils/errors');
const { handleError } = require('../utils/errorHandler');

/**
 * Se connecter
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await adminService.login(email, password);
    await adminLogService.logAction(result.user.id, 'login', { email });
    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: result
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Créer un admin
 */
const createAdmin = async (req, res) => {
  try {
    const admin = await adminService.createAdmin(req.body);
    await adminLogService.logAction(req.user.id, 'create_admin', { email: req.body.email, role: req.body.role });
    res.status(201).json({
      success: true,
      message: 'Utilisateur admin créé avec succès',
      data: admin
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Lister toutes les admin 
 */
const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminService.getAllAdmins();
    await adminLogService.logAction(req.user.id, 'list_admins', {});
    res.status(200).json({
      success: true,
      data: admins,
      count: admins.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Récupérer un admin par son ID
 */
const getAdminById = async (req, res) => {
  try {
    const admin = await adminService.getAdminById(req.params.id);
    await adminLogService.logAction(req.user.id, 'get_admin', { admin_id: req.params.id });
    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Modifier un admin
 */
const updateAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'super-admin' && req.user.id !== parseInt(req.params.id)) {
      throw new ValidationError('Accès non autorisé');
    }
    const updatedAdmin = await adminService.updateAdmin(req.params.id, req.body);
    await adminLogService.logAction(req.user.id, 'update_admin', { admin_id: req.params.id });
    res.status(200).json({
      success: true,
      message: 'Utilisateur admin mis à jour avec succès',
      data: updatedAdmin
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Désactiver un admin
 */
const disableAdmin = async (req, res) => {
  try {
    const updateAdmin = await adminService.disableAdmin(req.params.id);
    await adminLogService.logAction(req.user.id, 'disable_admin', { admin_id: req.params.id });
    res.status(200).json({
      success: true,
      message: 'Utilisateur admin désactivé avec succès',
      data: updateAdmin
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Réactiver un admin
 */
const reactivateAdmin = async (req, res) => {
  try {
    const updateAdmin = await adminService.reactivateAdmin(req.params.id);
    await adminLogService.logAction(req.user.id, 'reactivate_admin', { admin_id: req.params.id });
    res.status(200).json({
      success: true,
      message: 'Utilisateur admin réactiver avec succès',
      data: updateAdmin
    });
  } catch (error) {
    handleError(res, error);
  }
};


/**
 * Supprimer définitivement un admin
 */
const permanentlyDeleteAdmin = async (req, res) => {
  try {
    const result = await adminService.permanentlyDeleteAdmin(req.params.id);
    await adminLogService.logAction(req.user.id, 'delete_admin', { admin_id: req.params.id });
    res.status(200).json({
      success: true,
      message: 'Utilisateur admin supprimé avec succès',
      data: result
    });
  } catch (error) {
    handleError(res, error);
  }
};

const getLogs = async (req, res) => {
  try {
    const { admin_id, startDate, endDate } = req.query;
    const logs = await adminLogService.getLogs({ admin_id, startDate, endDate });
    await adminLogService.logAction(req.user.id, 'list_logs', { admin_id, startDate, endDate });
    res.status(200).json({
      success: true,
      data: logs,
      count: logs.length
    });
  } catch (error) {
    handleError(res, error);
  }
};

module.exports = {
  login,
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  disableAdmin,
  reactivateAdmin,
  permanentlyDeleteAdmin,
  getLogs
};