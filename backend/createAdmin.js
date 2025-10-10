
const { AdminUser } = require('./models');
const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('wili1234', 10);
    const admin = await AdminUser.create({
      email: 'wili@test.com',
      password_hash: hashedPassword,
      role: 'admin'
    });
    console.log('Admin créé :', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Erreur :', err.message);
    process.exit(1);
  }
}

createAdmin();
