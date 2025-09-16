// middlewares/auth.js
const AdminService = require('../service/admin.service');
const { ValidationError } = require('../utils/errors');

const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new ValidationError('Token requis');
    const decoded = AdminService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

// Autorisation par rôle
const authorizeRoles = (allowed = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Non authentifié' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès refusé. Rôle requis : ${allowed.join(' ou ')}`
      });
    }
    next();
  };
};

module.exports = { requireAdmin, authorizeRoles };
