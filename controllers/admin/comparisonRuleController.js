const { ComparisonRule } = require('../../models');

module.exports = {
  // Lister toutes les règles
async getAll(req, res) {
  try {
    // Récupérer un paramètre de filtre 
    const { active } = req.query;

    const whereClause = {};
    if (active !== undefined) {
      // Si active=true ou active=false, on filtre par is_active
      whereClause.is_active = active === "true";
    }

    // Récupérer toutes les règles selon le filtre
    const rules = await ComparisonRule.findAll({
      where: whereClause,
      order: [
        ['priority', 'ASC'],     
        ['created_at', 'DESC']   
      ]
    });

    // Si aucune règle n’est trouvée
    if (!rules || rules.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Aucune règle trouvée.",
        data: []
      });
    }

    // Sinon, retourner les règles
    res.json({
      success: true,
      count: rules.length,
      message: "Liste des règles récupérée avec succès.",
      data: rules
    });

  } catch (error) {
    console.error("Erreur lors de la récupération des règles :", error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
,

  // Créer une règle

  async create(req, res) {
    try {
      const { name, criteria_key, rule_definition, priority, is_active } = req.body;
      if (!name || !criteria_key || !rule_definition) {
        return res.status(400).json({
          success: false,
          error: "Les champs name, criteria_key et rule_definition sont obligatoires"
        });
      }

      const rule = await ComparisonRule.create({
        name,
        criteria_key,
        rule_definition,
        priority: priority || 1,
        is_active: is_active !== undefined ? is_active : true
      });

      res.status(201).json({
        success: true,
        message: "Règle créée avec succès",
        data: rule
      });
    } catch (error) {
      console.error("Erreur lors de la création :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },


  // Mettre à jour une règle
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, criteria_key, rule_definition, priority, is_active } = req.body;

      const rule = await ComparisonRule.findByPk(id);
      if (!rule) {
        return res.status(404).json({
          success: false,
          error: "Règle non trouvée"
        });
      }

      // Mise à jour avec uniquement les champs fournis
      await rule.update({
        name: name || rule.name,
        criteria_key: criteria_key || rule.criteria_key,
        rule_definition: rule_definition || rule.rule_definition,
        priority: priority !== undefined ? priority : rule.priority,
        is_active: is_active !== undefined ? is_active : rule.is_active
      });

      res.json({
        success: true,
        message: "Règle mise à jour avec succès",
        data: rule
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // Supprimer une règle existante
  async remove(req, res) {
    try {
      const { id } = req.params;

      // Vérifie si la règle existe
      const rule = await ComparisonRule.findByPk(id);
      if (!rule) {
        return res.status(404).json({
          success: false,
          message: `Aucune règle trouvée avec l'ID ${id}`
        });
      }

      // Suppression de la règle
      await rule.destroy();

      res.json({
        success: true,
        message: `Règle avec ID ${id} supprimée avec succès`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
 };
