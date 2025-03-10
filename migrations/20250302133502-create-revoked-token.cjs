'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('revoked_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      expiresAt: {
        type: Sequelize.DATE,
        field: "expires_at",
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('revoked_tokens');
  }
};