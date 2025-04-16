'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('foster_homes', {
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
      catshelpMentorId: {
        type: Sequelize.INTEGER,
        field: "catshelp_mentor_id",
        references: {
          model: "users",
          key: "id",
        },
      },
      location: {
        type: Sequelize.STRING
      },
      startDate: {
        type: Sequelize.DATE,
        field: "start_date",
      },
      endDate: {
        type: Sequelize.DATE,
        field: "end_date",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('foster_homes');
  }
};