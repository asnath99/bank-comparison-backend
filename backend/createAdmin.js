const bcrypt = require('bcryptjs');
const { AdminUser } = require('./models');
require('dotenv').config();

(async () => {
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('Erreur : Le mot de passe doit être fourni via la variable d\'environnement ADMIN_PASSWORD.');
    throw new Error('Mot de passe administrateur manquant.');
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [_admin, created] = await AdminUser.findOrCreate({
      where: { email: 'info@dokal-afica.com' },
      defaults: {
        password_hash: hashedPassword,
        role: 'super_admin',
        is_active: true,
      },
    });

    if (created) {
      console.log('Utilisateur administrateur "info@dokal-afica.com" créé avec succès.');
    } else {
      console.log('Utilisateur administrateur "info@dokal-afica.com" existe déjà.');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    throw new Error('Échec de la création de l\'administrateur.');
  }
})();