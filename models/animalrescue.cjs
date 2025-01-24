"use strict";
const { Model } = require("sequelize");
const { default: animal } = require("./animal.cjs");
module.exports = (sequelize, DataTypes) => {
  class AnimalRescue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AnimalRescue.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      identifier: DataTypes.INTEGER,
      rankNr: {
        type: DataTypes.INTEGER,
        field: "rank_nr",
      },
      rescueDate: {
        type: DataTypes.DATE,
        field: "rescue_date",
      },
      state: DataTypes.STRING,
      address: DataTypes.STRING,
      locationNotes: {
        type: DataTypes.STRING,
        field: "location_notes",
      },
    },
    {
      sequelize,
      modelName: "AnimalRescue",
      tableName: "animal_rescues",
      hooks: {
        // Et iga kuu rankNr nulli panna ja kassi unikaalne id (kujul aakknr) sättida
        beforeCreate: async (instance) => {
          const currentDate = new Date();

          const currentMonth = currentDate.getMonth(); // 0-based (0 = January)
          const currentYear = currentDate.getFullYear();

          // Fetch the last rescue record to check the current month
          const lastRescue = await AnimalRescue.findOne({
            order: [["id", "DESC"]],
          });

          if (
            !lastRescue ||
            lastRescue.rescueDate.getMonth() !== currentMonth ||
            lastRescue.rescueDate.getFullYear() !== currentYear
          ) {
            // If the month has changed, reset the rankNr
            instance.rankNr = 1; // Start fresh with rankNr 1 for the new month
          } else {
            // If the month is the same, increment the rankNr
            instance.rankNr = lastRescue.rankNr + 1; // Increment the rankNr based on the last record
          }

          const catIdent = `
          ${currentDate.getFullYear().toString().slice(-2)}${(
            currentDate.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}${instance.rankNr}`;
          instance.identifier = catIdent;
        },
      },
    }
  );
  return AnimalRescue;
};
