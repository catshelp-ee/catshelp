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
      email: {
        type: Sequelize.STRING
      },
      fullName: {
        type: Sequelize.STRING,
        field: "full_name",
      },
      identityCode: {
        type: Sequelize.STRING,
        field: "identity_code",
      },
      citizenship: {
        type: Sequelize.STRING
      },
      blacklisted: {
        type: Sequelize.BOOLEAN
      },
      blacklistedReason: {
        type: Sequelize.TEXT,
        field: "blacklisted_reason",
      },
      createdAt: {
        type: Sequelize.DATE,
        field: "created_at"
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};