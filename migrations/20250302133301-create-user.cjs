'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING
      },
      identityCode: {
        type: Sequelize.STRING
      },
      citizenship: {
        type: Sequelize.STRING
      },
      blacklisted: {
        type: Sequelize.BOOLEAN
      },
      blacklistedReason: {
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};