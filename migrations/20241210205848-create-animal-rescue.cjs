"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("animal_rescues", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      rankNr: {
        type: Sequelize.STRING,
        field: "rank_nr",
      },
      rescueDate: {
        type: Sequelize.DATE,
        field: "rescue_date",
      },
      location: {
        type: Sequelize.STRING,
      },
      locationNotes: {
        type: Sequelize.STRING,
        field: "location_notes",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("animal_rescues");
  },
};
