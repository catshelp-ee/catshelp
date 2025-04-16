'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foster_home_applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fosterHomeId: {
        type: Sequelize.INTEGER,
        field: "foster_home_id",
        references: {
          model: "foster_homes",
          key: "id",
        },
      },
      catshelpRepresentativeId: {
        type: Sequelize.INTEGER,
        field: "catshelp_representative_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      googleFormsSubmitDate: {
        type: Sequelize.DATE,
        field: "google_forms_submit_date",
      },
      nonCatshelpAnimals: {
        type: Sequelize.STRING,
        field: "non_catshelp_animals",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('foster_home_applications');
  }
};