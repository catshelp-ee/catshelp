"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("animal_to_animal_rescues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      animalId: {
        type: Sequelize.INTEGER,
        field: "animal_id",
        references: {
          model: "animals",
          key: "id",
        },
      },
      animalRescueId: {
        type: Sequelize.INTEGER,
        field: "animal_rescue_id",
        references: {
          model: "animal_rescues",
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("animal_to_animal_rescues");
  },
};
