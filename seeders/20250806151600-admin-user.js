'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  const passwordHash = await bcrypt.hash('admin123', 10);
    
    await queryInterface.bulkInsert('admin_users', [{
      email: 'admin@example.com',
      password_hash: passwordHash,
      role: 'super-admin',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('admin_users', {
      email: 'admin@example.com'
    }, {});
  }
};
