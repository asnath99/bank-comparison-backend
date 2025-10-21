// controllers/comparisonCriteriaController.js
const comparisonCriteriaService = require('../../service/comparisonCriteria.service.js');

module.exports = {
  // Lister tous les critères
  async getAll(req, res) {
    try {
      const criteria = await comparisonCriteriaService.getAllCriteriaForAdmin();
      res.json({ success: true, data: criteria });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Créer un critère
  async create(req, res) {
    try {
      const criteria = await comparisonCriteriaService.create(req.body);
      res.status(201).json({ success: true, message: 'Critère créé avec succès', data: criteria });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Mettre à jour un critère
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedCriteria = await comparisonCriteriaService.update(id, req.body);
      res.json({ success: true, message: 'Critère mis à jour avec succès', data: updatedCriteria });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Supprimer un critère
  async remove(req, res) {
    try {
      const { id } = req.params;
      await comparisonCriteriaService.permanentlyDelete(id);
      res.json({ success: true, message: 'Critère supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
