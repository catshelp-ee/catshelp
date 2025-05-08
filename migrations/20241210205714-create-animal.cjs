"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("animals", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      birthday: {
        type: Sequelize.DATE,
      },
      profileTitle: {
        type: Sequelize.TEXT,
        field: "profile_title",
      },
      description: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.STRING,
      },
      chipNumber: {
        type: Sequelize.STRING,
        field: "chip_number",
      },
      chipRegisteredWithUs: {
        type: Sequelize.BOOLEAN,
        field: "chip_registered_with_us",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("animals");
  },
};
