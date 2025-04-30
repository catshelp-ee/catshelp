'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('animal_to_foster_homes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      animalId: {
        type: Sequelize.INTEGER,
        field: "animal_id",
        references: {
          model: "animals",
          key: "id",
        },
      },
      fosterHomeId: {
        type: Sequelize.INTEGER,
        field: "foster_home_id",
        references: {
          model: "foster_homes",
          key: "id",
        },
      },
      fosterEndDate: {
        type: Sequelize.DATE,
        field: "foster_end_date",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('animal_to_foster_homes');
  }
};