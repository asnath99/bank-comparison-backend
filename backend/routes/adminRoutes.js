const express = require('express');
const adminController = require('../controllers/adminController');
const { validateAdmin, validateAdminUpdate } = require('../middleware/validateAdmin');
const { requireAdmin, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.post('/login', validateAdmin, adminController.login);

// Routes d'administration (requièrent authentification)
router.post('/users', requireAdmin, authorizeRoles(['super-admin']), validateAdmin, adminController.createAdmin);
router.get('/users', requireAdmin, adminController.getAllAdmins);
router.get('/users/:id', requireAdmin, adminController.getAdminById);
router.put('/users/:id', requireAdmin, validateAdminUpdate, adminController.updateAdmin);
router.delete('/users/:id', requireAdmin, authorizeRoles(['super-admin']), adminController.disableAdmin);
router.patch('/users/:id/reactivate', requireAdmin, authorizeRoles(['super-admin']), adminController.reactivateAdmin);
router.delete('/users/:id/permanent', requireAdmin, authorizeRoles(['super-admin']), adminController.permanentlyDeleteAdmin);
router.get('/logs', requireAdmin, adminController.getLogs);

module.exports = router;