'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contacts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        field: "user_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      contactType: {
        type: Sequelize.INTEGER,
        field: "contact_type",
      },
      value: {
        type: Sequelize.STRING
      },
      preferredContactMethod: {
        type: Sequelize.BOOLEAN,
        field: "preferred_contact_method",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contacts');
  }
};