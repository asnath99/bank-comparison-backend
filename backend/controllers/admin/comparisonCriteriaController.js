// controllers/comparisonCriteriaController.js
const { ComparisonCriteria } = require('../../models');

module.exports = {
  // Lister tous les critères
  async getAll(req, res) {
    try {
      const criteria = await ComparisonCriteria.findAll();
      res.json({ success: true, data: criteria });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Créer un critère
  async create(req, res) {
    try {
      const { key, label, description, data_mapping, scoring_strategy, is_active } = req.body;
      const criteria = await ComparisonCriteria.create({ key, label, description, data_mapping, scoring_strategy, is_active });
      res.json({ success: true, message: 'Critère créé avec succès', data: criteria });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Mettre à jour un critère
  async update(req, res) {
    try {
      const { id } = req.params;
      const { key, label, description, data_mapping, scoring_strategy, is_active } = req.body;

      const criteria = await ComparisonCriteria.findByPk(id);
      if (!criteria) return res.status(404).json({ success: false, error: 'Critère non trouvé' });

      await criteria.update({ key, label, description, data_mapping, scoring_strategy, is_active });
      res.json({ success: true, message: 'Critère mis à jour avec succès', data: criteria });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Supprimer un critère
  async remove(req, res) {
    try {
      const { id } = req.params;
      const criteria = await ComparisonCriteria.findByPk(id);
      if (!criteria) return res.status(404).json({ success: false, error: 'Critère non trouvé' });

      await criteria.destroy();
      res.json({ success: true, message: 'Critère supprimé avec succès' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};
