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
        type: Sequelize.INTEGER,
        field: "rank_nr",
        defaultValue: 1,
      },
      rescueDate: {
        type: Sequelize.DATE,
        field: "rescue_date",
      },
      state: {
        type: Sequelize.STRING,
      },
      address: {
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
